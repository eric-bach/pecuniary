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

  let mutation = `mutation updateAccountReadModel {
           updateAccountReadModel(input: {
             id: "${msg.data.id}"
             aggregateId: "${msg.aggregateId}"
             version: ${msg.version}
             userId: "${msg.userId}"
             name: "${msg.data.name}"
             description: "${msg.data.description}"
             bookValue: ${msg.data.bookValue}
             accountReadModelAccountTypeId: ${msg.data.accountAccountTypeId}
             updatedAt: "${msg.createdAt}"
           })
           {
             aggregateId
           }
         }`;

  console.debug("Mutation/Query: %j", mutation);
  await graphqlOperation(mutation, "updateAccountReadModel");
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
