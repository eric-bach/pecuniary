exports.handler = async event => {
  // TODO implement
  const response = {
    statusCode: 200,
    body: JSON.stringify("Hello from Lambda!")
  };

  console.log("Function has been invoked");

  const AWS = require("aws-sdk");
  var dynamodb = new AWS.DynamoDB();
  var param = {};
  dynamodb.listTables(param, function(err, data) {
    if (err) console.log(err, err.stack);
    // an error occurred
    else console.log(data); // successful response
  });

  return response;
};
