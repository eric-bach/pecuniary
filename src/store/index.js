import { combineReducers } from "redux";
import { reducer as FormReducer } from "redux-form";
import accountReducers from "../domain/account/reducers";
import authReducers from "../domain/auth/reducers";
import asyncReducer from "../domain/async/reducers";

const rootReducer = combineReducers({
  form: FormReducer,
  async: asyncReducer,
  auth: authReducers,
  accounts: accountReducers
});

export default rootReducer;
