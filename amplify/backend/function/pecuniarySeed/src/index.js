const https = require("https");
const AWS = require("aws-sdk");
const urlParse = require("url").URL;
const appsyncUrl = process.env.API_PECUNIARY_GRAPHQLAPIENDPOINTOUTPUT;
const region = process.env.REGION;
const endpoint = new urlParse(appsyncUrl).hostname.toString();
const apiKey = process.env.API_PECUNIARY_GRAPHQLAPIKEYOUTPUT;
const seedCurrencyTypes = require("./currencyTypes.js").mutation;
const seedAccountTypes = require("./accountTypes.js").mutation;
const seedTransactionTypes = require("./transactionTypes.js").mutation;
const seedExchangeTypes = require("./exchangeTypes.js").mutation;

exports.handler = async event => {
  await seed(seedAccountTypes, "seedAccountTypes");
  await seed(seedTransactionTypes, "seedTransactionTypes");
  await seed(seedCurrencyTypes, "seedCurrencyTypes");
  await seed(seedExchangeTypes, "seedExchangeTypes");

  return {
    statusCode: 200,
    body: "Success"
  };
};

async function seed(query, operationName) {
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
}
