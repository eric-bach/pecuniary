import { combineReducers } from "redux";
import accountReducers from "../components/Account/accountReducers";
import asyncReducer from "../components/Async/asyncReducer";

const rootReducer = combineReducers({ async: asyncReducer, accounts: accountReducers });

export default rootReducer;
