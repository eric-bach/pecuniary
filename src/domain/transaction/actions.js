import { API, graphqlOperation, Auth } from "aws-amplify";
import { listTransactionTypes } from "../../graphql/queries.js";
import { createEvent } from "../../graphql/mutations";
import { FETCH_TRANSACTION_TYPES, CREATE_TRANSACTION } from "./constants";
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

export const createTransaction = transaction => async dispatch => {
  dispatch(asyncActionStart());

  var userId;
  await Auth.currentUserInfo().then(user => {
    userId = user.attributes.sub;
  });

  const input = {
    aggregateId: transaction.aggregateId,
    name: "TransactionCreatedEvent",
    version: 1,
    data: JSON.stringify({
      symbol: transaction.symbol,
      transactionReadModelAccountId: transaction.account.id,
      transactionReadModelTransactionTypeId: transaction.transactionType.id,
      transactionDate: new Date(transaction.date).toISOString(),
      shares: transaction.shares,
      price: transaction.price,
      commission: transaction.commission,
      createdDate: new Date().toISOString()
    }),
    userId: userId,
    timestamp: new Date().toISOString()
  };
  await API.graphql(graphqlOperation(createEvent, { input }));

  dispatch({
    type: CREATE_TRANSACTION,
    payload: transaction
  });

  dispatch(asyncActionFinish());
};
