import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import Amplify from "aws-amplify";
import aws_exports from "./aws-exports";
import App from "./App.jsx";
import { configureStore } from "./app/store/configureStore";
import "./index.css";

Amplify.configure(aws_exports);

const store = configureStore();
console.log("Store: ", store.get); //TEMP

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
