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

  var event = JSON.parse(message).message;

  console.log("Saving event to read store:", event);

  // 1. Get all transactions matching UserId
  let transactionsQuery = `query listTransactionReadModels {
        listTransactionReadModels(filter: {
          userId:{
            eq:"${event.userId}"
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
  var transactions = await graphqlOperation(
    transactionsQuery,
    "listTransactionReadModels"
  );
  console.debug("Get transactions result: %j", transactions);

  // 2. Delete each transaction matching Account Id
  var trans = transactions.data.listTransactionReadModels.items.filter(
    e => e.account.id == event.data.id
  );
  trans.forEach(async t => {
    console.log(t.id);

    let deleteTransQuery = `mutation deleteTransactionReadModel {
          deleteTransactionReadModel(input: {
              id: "${t.id}"
            })
            {
              id
            }
          }`;
    console.debug("Delete transaction: %j", deleteTransQuery);
    var deleteTransResult = await graphqlOperation(
      deleteTransQuery,
      "deleteTransactionReadModel"
    );
    console.debug("Delete transaction result: %j", deleteTransResult);
  });

  // 3. Delete Account
  let query = `mutation deleteAccountReadModel {
          deleteAccountReadModel(input: {
            id: "${event.data.id}"
          })
          {
            id
          }
        }`;

  console.debug("Mutation/Query: %j", query);
  result = await graphqlOperation(query, "deleteAccountReadModel");
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
