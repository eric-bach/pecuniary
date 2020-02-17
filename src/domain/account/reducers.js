import { FETCH_ACCOUNTS } from "./constants";
import { createReducer } from "../../common/reducerUtils";

const INITIAL_STATE = {
  accounts: []
};

const fetchAccounts = (state, payload) => {
  return { ...state, accounts: payload };
};

export default createReducer(INITIAL_STATE, {
  [FETCH_ACCOUNTS]: fetchAccounts
});
