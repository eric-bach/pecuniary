import { FETCH_ACCOUNTS, UPDATE_ACCOUNT, CREATE_ACCOUNT, FETCH_ACCOUNT_TYPES, DELETE_ACCOUNT } from "./constants";
import { createReducer } from "../../common/reducerUtils";

const INITIAL_STATE = {
  accounts: [],
  accountTypes: []
};

const fetchAccounts = (state, payload) => {
  return { ...state, accounts: payload };
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
  [FETCH_ACCOUNTS]: fetchAccounts,
  [FETCH_ACCOUNT_TYPES]: fetchAccountTypes,
  [CREATE_ACCOUNT]: createAccount,
  [UPDATE_ACCOUNT]: updateAccount,
  [DELETE_ACCOUNT]: deleteAccount
});
