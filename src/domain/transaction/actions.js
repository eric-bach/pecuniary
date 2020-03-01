import { API, graphqlOperation, Auth } from "aws-amplify";
import { listTransactionTypes, listTransactionReadModels } from "../../graphql/queries.js";
import { createEvent } from "../../graphql/mutations";
import { FETCH_TRANSACTION_TYPES, FETCH_TRANSACTIONS, CREATE_TRANSACTION } from "./constants";
import { asyncActionStart, asyncActionFinish } from "../async/actions";
import { setIntervalAsync } from "../../common/apiUtils";

export const fetchTransactionTypes = () => async dispatch => {
  dispatch(asyncActionStart());

  setIntervalAsync(async () => {
    await API.graphql(graphqlOperation(listTransactionTypes)).then(result => {
      const transactionTypes = result.data.listTransactionTypes.items;

      dispatch({ type: FETCH_TRANSACTION_TYPES, payload: transactionTypes });
    });
  }, 2000);

  dispatch(asyncActionFinish());
};

export const fetchTransactions = (aggregateId, currentToken, nextToken) => async dispatch => {
  dispatch(asyncActionStart());

  var query;
  if (nextToken) {
    query = {
      filter: {
        aggrgateId: {
          eq: aggregateId
        }
      },
      nextToken: nextToken
    };
  } else {
    query = {
      filter: {
        aggregateId: {
          eq: aggregateId
        }
      }
    };
  }

  // Set prevToken to current Token
  currentToken = nextToken ? nextToken : null;

  await API.graphql(graphqlOperation(listTransactionReadModels, query)).then(result => {
    const transactions = result.data.listTransactionReadModels.items.sort((a, b) =>
      a.createdDate < b.createdDate ? 1 : -1
    );
    const nextToken = result.data.listTransactionReadModels.nextToken;

    dispatch({
      type: FETCH_TRANSACTIONS,
      payload: { transactions: transactions, prevToken: currentToken, nextToken: nextToken }
    });
  });

  dispatch(asyncActionFinish());
};

export const createTransaction = transaction => async dispatch => {
  dispatch(asyncActionStart());

  var userId;
  await Auth.currentUserInfo().then(user => {
    userId = user.attributes.sub;
  });

  const input = {
    aggregateId: transaction.account.aggregateId,
    name: "TransactionCreatedEvent",
    version: 1,
    data: JSON.stringify({
      symbol: transaction.symbol,
      transactionReadModelAccountId: transaction.account.id,
      transactionReadModelTransactionTypeId: transaction.transactionType.id,
      transactionDate: new Date(transaction.date).toISOString(),
      shares: transaction.shares,
      price: transaction.price,
      commission: transaction.commission
    }),
    userId: userId,
    createdAt: new Date().toISOString()
  };
  await API.graphql(graphqlOperation(createEvent, { input }));

  dispatch({
    type: CREATE_TRANSACTION,
    payload: transaction
  });

  dispatch(asyncActionFinish());
};
