/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var apiPecuniaryGraphQLAPIIdOutput = process.env.API_PECUNIARY_GRAPHQLAPIIDOUTPUT
var apiPecuniaryGraphQLAPIEndpointOutput = process.env.API_PECUNIARY_GRAPHQLAPIENDPOINTOUTPUT

Amplify Params - DO NOT EDIT */
const https = require("https");
const AWS = require("aws-sdk");
const urlParse = require("url").URL;
const appsyncUrl = process.env.API_BACKENDGRAPHQL_GRAPHQLAPIENDPOINTOUTPUT;
const region = process.env.REGION;
const endpoint = new urlParse(appsyncUrl).hostname.toString();
const graphqlQuery = require("./query.js").mutation;
const apiKey = process.env.API_KEY;

exports.handler = async event => {
  console.log("Starting to seed Pecuniary database");

  const req = new AWS.HttpRequest(appsyncUrl, region);

  const item = {
    input: {
      name: "Lambda Item",
      description: "Item Generated from Lambda"
    }
  };

  req.method = "POST";
  req.headers.host = endpoint;
  req.headers["Content-Type"] = "application/json";
  req.body = JSON.stringify({
    query: graphqlQuery,
    operationName: "createCurrencyType",
    variables: item
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

  return {
    statusCode: 200,
    body: data
  };
};
