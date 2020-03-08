const https = require("https");
const AWS = require("aws-sdk");
const urlParse = require("url").URL;
const appsyncUrl = process.env.API_PECUNIARY_GRAPHQLAPIENDPOINTOUTPUT;
const region = process.env.REGION;
const endpoint = new urlParse(appsyncUrl).hostname.toString();
const apiKey = process.env.API_PECUNIARY_GRAPHQLAPIKEYOUTPUT;

exports.handler = async e => {
  let event = JSON.parse(e.Records[0].Sns.Message).message;
  console.log("Event received:\n", event);

  // Get Positions for aggregate and symbol
  let positions = await getPositions(event.aggregateId, event.data.symbol);

  // Get the price from the TimeSeries quote
  let timeSeries = await getQuote(event.data.symbol);
  var price = timeSeries["05. price"];

  // Create or Update the Position
  if (positionExistsForSymbol(positions) === true) {
    await updatePosition(event, price, positions);
  } else {
    await createPosition(event, price);
  }

  // Update the Account book and market values
  // TODO Move this in separate service
  await updateAccount(event, price, positions);

  console.log(`Successfully processed ${e.Records.length} records.`);
};

async function getPositions(aggregateId, symbol) {
  let getPositionsQuery = `query getPositions {
    listPositionReadModels(filter: {
      aggregateId: {
        eq: "${aggregateId}"
      }
      symbol: {
        eq: "${symbol}"
      }
    })
    {
      items{
        id
        shares
        bookValue
      }
    }
  }`;
  console.debug("getPositions:\n", getPositionsQuery);

  var positions = await graphqlOperation(getPositionsQuery, "getPositions");
  console.log("Found Positions:\n", positions);

  return positions;
}

async function positionExistsForSymbol(positions) {
  try {
    if (positions.data.listPositionReadModels.items.length > 0) {
      return true;
    }
  } catch (error) {
    return false;
  }

  return false;
}

async function createPosition(event, price) {
  console.info("Position doesn't exist. Creating...");

  let bookValue = event.data.shares * event.data.price - event.data.commission;
  let marketValue = event.data.shares * price;
  let acb = bookValue / event.data.shares;

  const mutation = `mutation createPosition {
    createPositionReadModel(input: {
      aggregateId: "${event.aggregateId}"
      version: 1 
      userId: "${event.userId}"
      symbol: "${event.data.symbol}"
      shares: ${event.data.shares}
      acb: ${acb}
      bookValue: ${bookValue.toFixed(2)}
      marketValue: ${marketValue.toFixed(2)}
      createdAt: "${event.createdAt}"
      updatedAt: "${event.createdAt}"
      positionReadModelAccountId: "${event.data.transactionReadModelAccountId}"
    })
    {
      id
    }
  }`;
  console.debug("createPosition:\n", mutation);

  var result = await graphqlOperation(mutation, "createPosition");
  console.log("Created Position:\n", result);
}

async function updatePosition(event, price, positions) {
  console.info("Position exists. Updating...");

  let shares, bookValue;

  if (+event.data.transactionReadModelTransactionTypeId === 1) {
    // Buy
    shares = +positions.data.listPositionReadModels.items[0].shares + +event.data.shares;
    bookValue =
      +positions.data.listPositionReadModels.items[0].bookValue +
      (+event.data.shares * +event.data.price - +event.data.commission);
  } else {
    // Sell
    shares = +positions.data.listPositionReadModels.items[0].shares - +event.data.shares;
    bookValue =
      (+positions.data.listPositionReadModels.items[0].bookValue /
        +positions.data.listPositionReadModels.items[0].shares) *
      (+positions.data.listPositionReadModels.items[0].shares - +event.data.shares);
  }

  let acb = bookValue / shares;
  let marketValue = event.data.shares * price;

  var mutation = `mutation updatePosition {
        updatePositionReadModel(input: {
          id: "${positions.data.listPositionReadModels.items[0].id}"
          aggregateId: "${event.aggregateId}"
          symbol: "${event.data.symbol}"
          shares: ${shares}
          acb: ${acb.toFixed(2)}
          bookValue: ${bookValue}
          marketValue: ${marketValue.toFixed(2)}
          updatedAt: "${event.createdAt}"
        }) {
          id
          aggregateId
          symbol
          shares
          acb
          bookValue
          updatedAt
        }
      }`;
  console.debug("updatePosition:\n", mutation);

  var result = await graphqlOperation(mutation, "updatePosition");
  console.log("Updated Position:\n", result);
}

async function updateAccount(event, price, positions) {
  // Get the Account
  var accountQuery = `query getAccount {
    getAccountReadModel(id: "${event.data.transactionReadModelAccountId}") 
    {
      id
      bookValue
      marketValue
    }
  }`;
  console.debug("getAccount: %j", accountQuery);
  var account = await graphqlOperation(accountQuery, "getAccount");
  console.log("Found Account: %j", account);

  // Calculate the Account book and market values
  var bookValue, marketValue;
  if (+event.data.transactionReadModelTransactionTypeId === 1) {
    // Buy
    bookValue =
      +account.data.getAccountReadModel.bookValue + +(+event.data.shares * +event.data.price - +event.data.commission);
    marketValue = +account.data.getAccountReadModel.marketValue + +event.data.shares * +price;
  } else {
    // Sell
    bookValue =
      +account.data.getAccountReadModel.bookValue -
      +positions.data.listPositionReadModels.items[0].bookValue +
      (+positions.data.listPositionReadModels.items[0].bookValue /
        +positions.data.listPositionReadModels.items[0].shares) *
        (+positions.data.listPositionReadModels.items[0].shares - +event.data.shares);
    marketValue = +account.data.getAccountReadModel.marketValue + +event.data.shares * +price;
  }

  // Update the Account book and market values
  var updateAccountMutation = `mutation updateAccount {
    updateAccountReadModel(input: {
      id: "${event.data.transactionReadModelAccountId}"
      bookValue: ${bookValue}
      marketValue: ${marketValue}
    })
    {
      id
    }
  }`;
  console.debug("updateAccount:\n", updateAccountMutation);
  var updatedAccountResult = await graphqlOperation(updateAccountMutation, "updateAccount");
  console.log("Updated Account:\n", updatedAccountResult);
}

// Call AlphaVantage to get a GLOBAL_QUOTE
async function getQuote(symbol) {
  var result = await get(
    `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=SPRODHAE4BSL2OLB`
  );

  if (result["Error Message"]) {
    console.error("Error: ", result["Error Message"]);

    // Default to $0 for quotes not found
    return {
      "01. symbol": `${symbol}`,
      "02. open": "0",
      "03. high": "0",
      "04. low": "0",
      "05. price": "0",
      "06. volume": "0",
      "07. latest trading day": `${new Date().toISOString.substring(0, 10)}`,
      "08. previous close": "0",
      "09. change": "0",
      "10. change percent": "0%"
    };
  }

  return result["Global Quote"];
}

function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, res => {
      res.setEncoding("utf8");
      let body = "";

      res.on("data", chunk => {
        body += chunk;
      });

      res.on("end", () => {
        resolve(JSON.parse(body));
      });
    });

    req.on("error", err => {
      reject(err);
    });

    req.end();
  });
}

async function graphqlOperation(query, operationName) {
  const req = new AWS.HttpRequest(appsyncUrl, region);

  req.method = "POST";
  req.headers.host = endpoint;
  req.headers["Content-Type"] = "application/json";
  req.body = JSON.stringify({
    query: query,
    operationName: operationName
  });

  if (apiKey) {
    req.headers["x-api-key"] = apiKey;
  } else {
    const signer = new AWS.Signers.V4(req, "appsync", true);
    signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());
  }

  const data = await new Promise((resolve, reject) => {
    const httpRequest = https.request({ ...req, host: endpoint }, result => {
      result.on("data", data => {
        resolve(JSON.parse(data.toString()));
      });
    });

    httpRequest.write(req.body);
    httpRequest.end();
  });

  return data;
}
