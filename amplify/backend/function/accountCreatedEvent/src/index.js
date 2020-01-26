/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var apiPecuniaryGraphQLAPIIdOutput = process.env.API_PECUNIARY_GRAPHQLAPIIDOUTPUT
var apiPecuniaryGraphQLAPIEndpointOutput = process.env.API_PECUNIARY_GRAPHQLAPIENDPOINTOUTPUT

Amplify Params - DO NOT EDIT */

exports.handler = async event => {
  var message = event.Records[0].Sns.Message;

  console.log("Message received from SNS:", message);
};
