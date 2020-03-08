/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var apiPecuniaryGraphQLAPIIdOutput = process.env.API_PECUNIARY_GRAPHQLAPIIDOUTPUT
var apiPecuniaryGraphQLAPIEndpointOutput = process.env.API_PECUNIARY_GRAPHQLAPIENDPOINTOUTPUT

Amplify Params - DO NOT EDIT */const https = require("https");
const AWS = require("aws-sdk");
const urlParse = require("url").URL;
const appsyncUrl = process.env.API_PECUNIARY_GRAPHQLAPIENDPOINTOUTPUT;
const region = process.env.REGION;
const endpoint = new urlParse(appsyncUrl).hostname.toString();
const apiKey = process.env.API_PECUNIARY_GRAPHQLAPIKEYOUTPUT;

exports.handler = async e => {
  var message = e.Records[0].Sns.Message;
  console.log("Message received:", message);

  var event = JSON.parse(message).message;
  console.log("Parsed event:", event);

  // 1. Check if a position exists
  let getPositionQuery = `query getPosition {
      listPositionReadModels(filter: {
        aggregateId: {
          eq: "${event.aggregateId}"
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
  console.debug("getPosition: %j", getPositionQuery);
  var positions = await graphqlOperation(getPositionQuery, "getPosition");
  console.log("Found Position: %j", positions);

  // 2. Check if position exists
  var timeSeries = await getQuote(event.data.symbol);
  var bookValue;
  let marketValue = event.data.shares * timeSeries["05. price"];

  if (positions.data.listPositionReadModels.items.length <= 0) {
    console.log("Position doesn't exist...creating...");

    bookValue = event.data.shares * event.data.price - event.data.commission;
    var acb = bookValue / event.data.shares;

    var createPositionMutation = `mutation createPosition {
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
    console.debug("createPosition: %j", createPositionMutation);
    var createPositionResult = await graphqlOperation(createPositionMutation, "createPosition");
    console.log("Created Position: %j", createPositionResult);
  } else {
    console.log("Position exists...updating...");

    let shares;
    if (+event.data.transactionReadModelTransactionTypeId === 2) {
      // Sell
      shares = +positions.data.listPositionReadModels.items[0].shares - +event.data.shares;
      bookValue =
        (+positions.data.listPositionReadModels.items[0].bookValue /
          +positions.data.listPositionReadModels.items[0].shares) *
        (+positions.data.listPositionReadModels.items[0].shares - +event.data.shares);
    } else {
      // Buy
      shares = +positions.data.listPositionReadModels.items[0].shares + +event.data.shares;
      bookValue =
        +positions.data.listPositionReadModels.items[0].bookValue +
        (+event.data.shares * +event.data.price - +event.data.commission);
    }

    let acb = bookValue / shares;

    var updatePositionMutation = `mutation updatePosition {
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
    console.debug("updatePosition: %j", updatePositionMutation);
    var updatePositionResult = await graphqlOperation(updatePositionMutation, "updatePosition");
    console.log("Updated Position: %j", updatePositionResult);
  }

  // 1. Get Account
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

  // 2. Calculate new Account book value
  var newBookValue;
  var newMarketValue;
  console.log(+account.data.getAccountReadModel.marketValue);
  console.log(+event.data.shares);
  console.log(+timeSeries["05. price"]);
  console.log(+event.data.shares * +timeSeries["05. price"]);
  if (+event.data.transactionReadModelTransactionTypeId === 2) {
    // Sell
    newBookValue =
      +account.data.getAccountReadModel.bookValue -
      +positions.data.listPositionReadModels.items[0].bookValue +
      (+positions.data.listPositionReadModels.items[0].bookValue /
        +positions.data.listPositionReadModels.items[0].shares) *
        (+positions.data.listPositionReadModels.items[0].shares - +event.data.shares);
    newMarketValue = +account.data.getAccountReadModel.marketValue + +event.data.shares * +timeSeries["05. price"];
  } else {
    // Buy
    newBookValue =
      +account.data.getAccountReadModel.bookValue + +(+event.data.shares * +event.data.price - +event.data.commission);
    newMarketValue = +account.data.getAccountReadModel.marketValue + +event.data.shares * +timeSeries["05. price"];
  }

  // 3. Update Account book value
  var updateAccountMutation = `mutation updateAccount {
    updateAccountReadModel(input: {
      id: "${event.data.transactionReadModelAccountId}"
      bookValue: ${newBookValue}
      marketValue: ${newMarketValue}
    })
    {
      id
    }
  }`;
  console.debug("updateAccount: %j", updateAccountMutation);
  var updatedAccountResult = await graphqlOperation(updateAccountMutation, "updateAccount");
  console.log("Updated Account: %j", updatedAccountResult);

  console.log(`Successfully processed ${e.Records.length} records.`);
};

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
