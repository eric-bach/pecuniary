import React from "react";
import { withAuthenticator } from "aws-amplify-react";

function App() {
  return <div className="App">Pecuniary</div>;
}

export default withAuthenticator(App, { includeGreetings: true });
