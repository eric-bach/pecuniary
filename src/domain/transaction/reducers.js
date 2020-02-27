import { CREATE_TRANSACTION, FETCH_TRANSACTION_TYPES, FETCH_TRANSACTIONS } from "./constants";
import { createReducer } from "../../common/reducerUtils";

const INITIAL_STATE = {
  transactions: [],
  transactionTypes: []
};

const fetchTransactionTypes = (state, payload) => {
  return { ...state, transactionTypes: payload };
};

const fetchTransactions = (state, payload) => {
  return { ...state, transactions: payload.transactions, prevToken: payload.prevToken, nextToken: payload.nextToken };
};

const createTransaction = (state, payload) => {
  return { transactions: [payload] };
};

export default createReducer(INITIAL_STATE, {
  [FETCH_TRANSACTION_TYPES]: fetchTransactionTypes,
  [FETCH_TRANSACTIONS]: fetchTransactions,
  [CREATE_TRANSACTION]: createTransaction
});
