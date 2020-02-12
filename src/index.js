import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import Amplify from "aws-amplify";
import aws_exports from "./aws-exports";
import App from "./App.jsx";
import "./index.css";

Amplify.configure(aws_exports);

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
