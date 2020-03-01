import {
  GET_ACCOUNT,
  FETCH_ACCOUNTS,
  UPDATE_ACCOUNT,
  CREATE_ACCOUNT,
  FETCH_ACCOUNT_TYPES,
  DELETE_ACCOUNT
} from "./constants";
import { createReducer } from "../../common/reducerUtils";

const INITIAL_STATE = {
  account: null,
  accounts: [],
  prevToken: null,
  nextToken: null,
  accountTypes: []
};

const getAccount = (state, payload) => {
  return { ...state, account: payload.account };
};

const fetchAccounts = (state, payload) => {
  return { ...state, accounts: payload.accounts, prevToken: payload.prevToken, nextToken: payload.nextToken };
};

const fetchAccountTypes = (state, payload) => {
  return { ...state, accountTypes: payload };
};

const createAccount = (state, payload) => {
  return { accounts: [payload] };
};

const updateAccount = (state, payload) => {
  return { accounts: [...state.accounts.filter(account => account.id !== payload.id), payload] };
};

const deleteAccount = (state, payload) => {
  return { accounts: [...state.accounts.filter(account => account.id !== payload.accountId)] };
};

export default createReducer(INITIAL_STATE, {
  [GET_ACCOUNT]: getAccount,
  [FETCH_ACCOUNTS]: fetchAccounts,
  [FETCH_ACCOUNT_TYPES]: fetchAccountTypes,
  [CREATE_ACCOUNT]: createAccount,
  [UPDATE_ACCOUNT]: updateAccount,
  [DELETE_ACCOUNT]: deleteAccount
});
