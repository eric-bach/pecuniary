import { FETCH_ACCOUNTS, UPDATE_ACCOUNT, CREATE_ACCOUNT } from "./constants";
import { createReducer } from "../../common/reducerUtils";

const INITIAL_STATE = {
  accounts: []
};

const fetchAccounts = (state, payload) => {
  return { ...state, accounts: payload };
};

const createAccount = (state, payload) => {
  return { accounts: [payload] };
};

const updateAccount = (state, payload) => {
  return { accounts: [...state.accounts.filter(account => account.id !== payload.id), payload] };
};

export default createReducer(INITIAL_STATE, {
  [FETCH_ACCOUNTS]: fetchAccounts,
  [CREATE_ACCOUNT]: createAccount,
  [UPDATE_ACCOUNT]: updateAccount
});
