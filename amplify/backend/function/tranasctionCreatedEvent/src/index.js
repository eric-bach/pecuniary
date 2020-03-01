const https = require("https");
const AWS = require("aws-sdk");
const urlParse = require("url").URL;
const appsyncUrl = process.env.API_PECUNIARY_GRAPHQLAPIENDPOINTOUTPUT;
const region = process.env.REGION;
const endpoint = new urlParse(appsyncUrl).hostname.toString();
const apiKey = process.env.API_PECUNIARY_GRAPHQLAPIKEYOUTPUT;

exports.handler = async event => {
  var message = event.Records[0].Sns.Message;

  console.log("Message received from SNS:", message);

  var msg = JSON.parse(message).message;

  console.log("Saving event to read store:", msg);

  let query = `mutation createTransactionReadModel {
        createTransactionReadModel(input: {
          aggregateId: "${msg.aggregateId}"
          version: ${msg.version}
          userId: "${msg.userId}"
          transactionDate: "${msg.data.transactionDate}"
          symbol: "${msg.data.symbol}"
          shares: ${msg.data.shares}
          price: ${msg.data.price}
          commission: ${msg.data.commission}
          transactionReadModelAccountId: "${msg.data.transactionReadModelAccountId}"
          transactionReadModelTransactionTypeId: ${msg.data.transactionReadModelTransactionTypeId}
          createdAt: "${msg.createdAt}"
          updatedAt: "${msg.createdAt}"
        })
        {
          aggregateId
        }
      }`;
  console.debug("Mutation/Query: %j", query);
  var result = await graphqlOperation(query, "createTransactionReadModel");

  //
  // Update PositionsReadModel with the transaction (maybe this can be another subscriber of the topic)
  // 1. Find if a position exists
  let positionQuery = `query listPositionReadModels {
    listPositionReadModels(filter: {
      aggregateId: {
        eq: "${msg.aggregateId}"
      }
      symbol: {
        eq: "${msg.data.symbol}"
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
  var positions = await graphqlOperation(positionQuery, "listPositionReadModels");
  // 2. Check if position exists
  if (positions.data.listPositionReadModels.items.length <= 0) {
    console.log("Position doesn't exist...creating...");

    var bookValue = msg.data.shares * msg.data.price - msg.data.commission;
    var acb = bookValue / msg.data.shares;

    var positionMutation = `mutation createPosition {
      createPositionReadModel(input: {
        aggregateId: "${msg.aggregateId}"
        version: 1 
        userId: "${msg.userId}"
        symbol: "${msg.data.symbol}"
        shares: ${msg.data.shares}
        acb: ${acb}
        bookValue: ${bookValue.toFixed(2)}
        createdAt: "${msg.createdAt}"
        updatedAt: "${msg.createdAt}"
        positionReadModelAccountId: "${msg.data.transactionReadModelAccountId}"
      })
      {
        id
      }
    }`;
    console.log(positionMutation);
    await graphqlOperation(positionMutation, "createPosition");
  } else {
    console.log("Position exists...updating...");

    let shares;
    console.log(msg.data.transactionReadModelTransactionTypeId);
    if (+msg.data.transactionReadModelTransactionTypeId === 2) {
      shares = +positions.data.listPositionReadModels.items[0].shares - +msg.data.shares;
    } else {
      shares = +positions.data.listPositionReadModels.items[0].shares + +msg.data.shares;
    }

    let bookValue =
      +positions.data.listPositionReadModels.items[0].bookValue +
      (+msg.data.shares * +msg.data.price - +msg.data.commission);
    let acb = bookValue / shares;

    var positionUpdateMutation = `mutation updatePosition {
      updatePositionReadModel(input: {
        id: "${positions.data.listPositionReadModels.items[0].id}"
        aggregateId: "${msg.aggregateId}"
        symbol: "${msg.data.symbol}"
        shares: ${shares}
        acb: ${acb.toFixed(2)}
        bookValue: ${bookValue}
        updatedAt: "${msg.createdAt}"
      }) {
        id
      }
    }`;
    await graphqlOperation(positionUpdateMutation, "updatePosition");
  }
  //

  //
  // Update Account

  //

  console.log("Result: %j", result);
  console.log(`Successfully processed ${event.Records.length} records.`);
};

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
