import { combineReducers } from "redux";
import accountReducers from "../domain/account/reducers";
import authReducers from "../domain/auth/reducers";
import asyncReducer from "../domain/async/reducers";

const rootReducer = combineReducers({ async: asyncReducer, auth: authReducers, accounts: accountReducers });

export default rootReducer;
