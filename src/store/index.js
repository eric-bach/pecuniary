import { combineReducers } from "redux";
import accountReducers from "../components/Account/accountReducers";
import authReducers from "../components/Auth/authReducers";
import asyncReducer from "../components/Async/asyncReducer";

const rootReducer = combineReducers({ async: asyncReducer, auth: authReducers, accounts: accountReducers });

export default rootReducer;
