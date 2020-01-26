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

  let query = `mutation createTransactionReadModel {
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
          createdDate: "${event.data.createdDate}"
        })
        {
          aggregateId
        }
      }`;

  console.debug("Mutation/Query: %j", query);
  result = await graphqlOperation(query, "createTransactionReadModel");

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
