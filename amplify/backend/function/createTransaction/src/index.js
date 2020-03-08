const https = require("https");
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

  let createTransactionMutation = `mutation createTransaction {
          createTransactionReadModel(input: {
            aggregateId: "${event.aggregateId}"
            version: ${event.version}
            userId: "${event.userId}"
            transactionDate: "${event.data.transactionDate}"
            symbol: "${event.data.symbol}"
            shares: ${event.data.shares}
            price: ${event.data.price}
            commission: ${event.data.commission}
            transactionReadModelAccountId: "${event.data.transactionReadModelAccountId}"
            transactionReadModelTransactionTypeId: ${event.data.transactionReadModelTransactionTypeId}
            createdAt: "${event.createdAt}"
            updatedAt: "${event.createdAt}"
          })
          {
            id
            aggregateId
          }
        }`;

  console.debug("createTransaction: %j", createTransactionMutation);
  var createTransactionResult = await graphqlOperation(createTransactionMutation, "createTransaction");
  console.log("Created Transaction: %j", createTransactionResult);
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
