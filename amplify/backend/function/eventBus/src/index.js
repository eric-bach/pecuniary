const AWS = require("aws-sdk");
const accountCreatedEventTopic =
  process.env.SNS_EVENTBUS_ACCOUNTCREATEDEVENTTOPICARN;
const accountUpdatedEventTopic =
  process.env.SNS_EVENTBUS_ACCOUNTUPDATEDEVENTTOPICARN;
const accountDeletedEventTopic =
  process.env.SNS_EVENTBUS_ACCOUNTDELETEDEVENTTOPICARN;
const transactionCreatedEventTopic =
  process.env.SNS_EVENTBUS_TRANSACTIONCREATEDEVENTTOPICARN;

exports.handler = async (event, context) => {
  var sns = new AWS.SNS({ apiVersion: "2010-03-31", region: "us-west-2" });

  console.log("Beginning to process %j records...", event.Records.length);

  for (const record of event.Records) {
    console.log("Event ID: %j", record.eventID);
    console.log("Event Name: %j", record.eventName);
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
    console.log("Version: %j", version);
    console.log("Data: %j", data);
    console.log("User Id: %j", userId);

    const type = "json";
    var message = {
      aggregateId: aggregateId,
      version: version,
      userId: userId,
      data: data
    };

    var topic;
    if (eventName === "AccountCreatedEvent") {
      topic = accountCreatedEventTopic;
    } else if (eventName === "AccountUpdatedEvent") {
      topic = accountUpdatedEventTopic;
    } else if (eventName === "AccountDeletedEvent") {
      topic = accountDeletedEventTopic;
    } else if (eventName === "TransactionCreatedEvent") {
      topic = transactionCreatedEventTopic;
    }

    console.log("Sending event to SNS for further processing");
    console.log("Message: %j", message);
    console.log("Topic: %j", topic);

    const params = {
      Message: JSON.stringify({ message, type }),
      TopicArn: topic
    };

    await sns.publish(params).promise();
  }

  console.log("Stream processing complete");
};

function trim(str) {
  return str.replace(/^"(.*)"$/, "$1");
}
