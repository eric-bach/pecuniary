import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./store";

export const configureStore = () => {
  const middlewares = [thunk];

  const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middlewares)));

  return store;
};
