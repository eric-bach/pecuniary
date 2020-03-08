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

  // 1. Check if a time series exists
  let getTimeSeriesQuery = `query getTimeSeries {
    listTimeSeriess(filter: {
      symbol: {
        eq: "${event.data.symbol}"
      }
    })
    {
      items{
        id
      }
    }
  }`;
  console.debug("getTimeSeries: %j", getTimeSeriesQuery);
  var timeSeriesResult = await graphqlOperation(getTimeSeriesQuery, "getTimeSeries");
  console.log("Found TimeSeries: %j", timeSeriesResult);

  // 2. Check if time series exists
  var timeSeries = await getQuote(event.data.symbol);
  console.log(`TimeSeries for ${event.data.symbol}: `, timeSeries);
  // TODO Handle error
  if (
    !timeSeriesResult.data.listTImeSeriess ||
    !timeSeriesResult.data.listTImeSeriess.items ||
    timeSeriesResult.data.listTImeSeriess.items.length <= 0
  ) {
    console.log("TimeSeries doesn't exist...creating...");

    // Create TimeSeries
    var createTimeSeriesMutation = `mutation createTimeSeries {
      createTimeSeries(input: {
        symbol: "${event.data.symbol}"
        date: "${timeSeries["07. latest trading day"]}"
        open: ${timeSeries["02. open"]}
        high: ${timeSeries["03. high"]}
        low: ${timeSeries["04. low"]}
        close: ${timeSeries["05. price"]}
        volume: ${timeSeries["06. volume"]}
      })
      {
        id
      }
    }`;
    console.debug("createTimeSeries: %j", createTimeSeriesMutation);
    var createTimeSeriesResult = await graphqlOperation(createTimeSeriesMutation, "createTimeSeries");
    console.log("Created TimeSeries: %j", createTimeSeriesResult);
  }

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
