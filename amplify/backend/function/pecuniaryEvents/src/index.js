const https = require("https");
const AWS = require("aws-sdk");
const urlParse = require("url").URL;
const appsyncUrl = process.env.API_PECUNIARY_GRAPHQLAPIENDPOINTOUTPUT;
const region = process.env.REGION;
const endpoint = new urlParse(appsyncUrl).hostname.toString();
const apiKey = process.env.API_PECUNIARY_GRAPHQLAPIKEYOUTPUT;

console.log("Loading function");

exports.handler = async (event, context) => {
  let result = "";

  for (const record of event.Records) {
    console.log("DynamoDB Record: %j", record.dynamodb);

    var aggregateId = record.dynamodb.OldImage
      ? trim(record.dynamodb.OldImage.aggregateId.S)
      : trim(record.dynamodb.NewImage.aggregateId.S);
    var userId = record.dynamodb.OldImage
      ? trim(record.dynamodb.OldImage.userId.S)
      : trim(record.dynamodb.NewImage.userId.S);
    var version = record.dynamodb.OldImage
      ? record.dynamodb.OldImage.version.N
      : record.dynamodb.NewImage.version.N;
    var eventName = record.dynamodb.OldImage
      ? trim(record.dynamodb.OldImage.name.S)
      : trim(record.dynamodb.NewImage.name.S);
    var data = record.dynamodb.OldImage
      ? JSON.parse(trim(record.dynamodb.OldImage.data.S))
      : JSON.parse(trim(record.dynamodb.NewImage.data.S));

    console.log("Aggregate Id: %j", aggregateId);
    console.log("Event: %j", eventName);
    console.log("Data: %j", data);

    console.debug("De-normalizing %j", eventName);

    if (eventName === "AccountCreatedEvent") {
      let query = `mutation createAccountReadModel {
          createAccountReadModel(input: {
            aggregateId: "${aggregateId}"
            version: ${version}
            userId: "${userId}"
            name: "${data.name}"
            description: "${data.description}"
            accountReadModelAccountTypeId: ${data.accountAccountTypeId}
            createdDate: "${data.createdDate}"
          })
          {
            aggregateId
          }
        }`;

      console.debug("Mutation/Query: %j", query);
      result = await graphqlOperation(query, "createAccountReadModel");
    } else if (eventName === "AccountUpdatedEvent") {
      let query = `mutation updateAccountReadModel {
          updateAccountReadModel(input: {
            id: "${data.id}"
            aggregateId: "${aggregateId}"
            version: ${version}
            userId: "${userId}"
            name: "${data.name}"
            description: "${data.description}"
            accountReadModelAccountTypeId: ${data.accountAccountTypeId}
          })
          {
            aggregateId
          }
        }`;

      console.debug("Mutation/Query: %j", query);
      result = await graphqlOperation(query, "updateAccountReadModel");
    } else if (eventName === "AccountDeletedEvent") {
      // 1. Get all transactions matching UserId
      let transactionsQuery = `query listTransactionReadModels {
        listTransactionReadModels(filter: {
          userId:{
            eq:"${userId}"
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
        e => e.account.id == data.id
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
            id: "${data.id}"
          })
          {
            id
          }
        }`;

      console.debug("Mutation/Query: %j", query);
      result = await graphqlOperation(query, "deleteAccountReadModel");
      console.debug("Delete account result: %j", result);
    } else if (eventName === "TransactionCreatedEvent") {
      let query = `mutation createTransactionReadModel {
          createTransactionReadModel(input: {
            aggregateId: "${aggregateId}"
            version: ${version}
            userId: "${userId}"
            transactionDate: "${data.transactionDate}"
            symbol: "${data.symbol}"
            shares: ${data.shares}
            price: ${data.price}
            commission: ${data.commission}
            transactionReadModelAccountId: "${data.transactionReadModelAccountId}"
            transactionReadModelTransactionTypeId: ${data.transactionReadModelTransactionTypeId}
            createdDate: "${data.createdDate}"
          })
          {
            aggregateId
          }
        }`;

      console.debug("Mutation/Query: %j", query);
      result = await graphqlOperation(query, "createTransactionReadModel");
    }
  }

  console.log("Result: %j", result);
  console.log(`Successfully processed ${event.Records.length} records.`);
};

function trim(str) {
  return str.replace(/^"(.*)"$/, "$1");
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
