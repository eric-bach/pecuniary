exports.handler = async event => {
  // TODO implement
  const response = {
    statusCode: 200,
    body: JSON.stringify("Hello from Lambda!")
  };

  console.log("Function has been invoked");

  return response;
};
