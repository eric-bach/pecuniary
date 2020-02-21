import { CREATE_TRANSACTION, FETCH_TRANSACTION_TYPES } from "./constants";
import { createReducer } from "../../common/reducerUtils";

const INITIAL_STATE = {
  transactions: [],
  transactionTypes: []
};

const fetchTransactionTypes = (state, payload) => {
  return { ...state, transactionTypes: payload };
};

const createTransaction = (state, payload) => {
  return { transactions: [payload] };
};

export default createReducer(INITIAL_STATE, {
  [FETCH_TRANSACTION_TYPES]: fetchTransactionTypes,
  [CREATE_TRANSACTION]: createTransaction
});
