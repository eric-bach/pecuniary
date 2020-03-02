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

  // 1. Get all transactions matching UserId
  let positionsQuery = `query listPositions {
    listPositionReadModels(filter: {
      userId:{
        eq:"${msg.userId}"
      }
    }) {
      items {
        id
        account {
          id
        }
      }
    }
  }`;
  console.debug("Get positions: %j", positionsQuery);
  var positions = await graphqlOperation(positionsQuery, "listPositions");
  console.debug("Get positions result: %j", positions);

  // 2. Delete each position matching Account Id
  var pos = positions.data.listPositionReadModels.items.filter(e => e.account.id === msg.data.id);
  pos.forEach(async p => {
    let deletePositionsQuery = `mutation deletePosition {
          deletePositionReadModel(input: {
              id: "${p.id}"
            })
            {
              id
            }
          }`;
    console.debug("Delete position: %j", deletePositionsQuery);
    var deletePositionResult = await graphqlOperation(deletePositionsQuery, "deletePosition");
    console.debug("Delete position result: %j", deletePositionResult);
  });

  // 3. Get all transactions matching UserId
  let transactionsQuery = `query listTransactionReadModels {
        listTransactionReadModels(filter: {
          userId:{
            eq:"${msg.userId}"
          }
        }) {
          items {
            id
            account {
              id
            }
          }
        }
      }`;
  console.debug("Get transactions: %j", transactionsQuery);
  var transactions = await graphqlOperation(transactionsQuery, "listTransactionReadModels");
  console.debug("Get transactions result: %j", transactions);

  // 4. Delete each transaction matching Account Id
  var trans = transactions.data.listTransactionReadModels.items.filter(e => e.account.id === msg.data.id);
  trans.forEach(async t => {
    let deleteTransQuery = `mutation deleteTransactionReadModel {
          deleteTransactionReadModel(input: {
              id: "${t.id}"
            })
            {
              id
            }
          }`;
    console.debug("Delete transaction: %j", deleteTransQuery);
    var deleteTransResult = await graphqlOperation(deleteTransQuery, "deleteTransactionReadModel");
    console.debug("Delete transaction result: %j", deleteTransResult);
  });

  // 5. Delete Account
  let query = `mutation deleteAccountReadModel {
          deleteAccountReadModel(input: {
            id: "${msg.data.id}"
          })
          {
            id
          }
        }`;

  console.debug("Mutation/Query: %j", query);
  var result = await graphqlOperation(query, "deleteAccountReadModel");
  console.debug("Delete account result: %j", result);
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
