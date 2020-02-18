import { API, graphqlOperation, Auth } from "aws-amplify";
import { createEvent } from "../../graphql/mutations";
import { listAccountReadModels, listAccountTypes } from "../../graphql/queries.js";
import { FETCH_ACCOUNTS, CREATE_ACCOUNT, UPDATE_ACCOUNT, FETCH_ACCOUNT_TYPES, DELETE_ACCOUNT } from "./constants";
import { asyncActionStart, asyncActionFinish } from "../async/actions";
import { setIntervalAsync } from "../../common/apiUtils";

export const fetchAccounts = userId => async dispatch => {
  dispatch(asyncActionStart());

  setIntervalAsync(async () => {
    await Auth.currentUserInfo().then(user => {
      userId = user.attributes.sub;
    });

    await API.graphql(
      graphqlOperation(listAccountReadModels, {
        limit: 50,
        filter: {
          userId: {
            eq: userId
          }
        }
      })
    ).then(result => {
      const accounts = result.data.listAccountReadModels.items.sort((a, b) => (a.createdDate < b.createdDate ? 1 : -1));

      dispatch({
        type: FETCH_ACCOUNTS,
        payload: accounts
      });
    });
  }, 2000);

  dispatch(asyncActionFinish());
};

export const fetchAccountTypes = () => async dispatch => {
  dispatch(asyncActionStart());

  setIntervalAsync(async () => {
    await API.graphql(graphqlOperation(listAccountTypes)).then(result => {
      const accountTypes = result.data.listAccountTypes.items;

      dispatch({ type: FETCH_ACCOUNT_TYPES, payload: accountTypes });
    });
  }, 2000);

  dispatch(asyncActionFinish());
};

export const createAccount = account => async dispatch => {
  dispatch(asyncActionStart());

  var userId;
  await Auth.currentUserInfo().then(user => {
    userId = user.attributes.sub;
  });

  const input = {
    aggregateId: account.aggregateId,
    name: "AccountCreatedEvent",
    version: 1,
    data: JSON.stringify({
      name: account.name,
      description: account.description,
      accountAccountTypeId: account.accountType.id,
      createdDate: new Date().toISOString()
    }),
    userId: userId,
    timestamp: new Date().toISOString()
  };
  await API.graphql(graphqlOperation(createEvent, { input }));

  dispatch({
    type: CREATE_ACCOUNT,
    payload: account
  });

  dispatch(asyncActionFinish());
};

export const updateAccount = account => async dispatch => {
  dispatch(asyncActionStart());

  var userId;
  await Auth.currentUserInfo().then(user => {
    userId = user.attributes.sub;
  });

  const input = {
    aggregateId: account.aggregateId,
    name: "AccountUpdatedEvent",
    version: account.version + 1,
    data: JSON.stringify({
      id: account.id,
      name: account.name,
      description: account.description,
      accountAccountTypeId: account.accountType.id
    }),
    userId: userId,
    timestamp: new Date().toISOString()
  };
  await API.graphql(graphqlOperation(createEvent, { input }));

  dispatch({
    type: UPDATE_ACCOUNT,
    payload: account
  });

  dispatch(asyncActionFinish());
};

export const deleteAccount = account => async dispatch => {
  var userId;
  await Auth.currentUserInfo().then(user => {
    userId = user.attributes.sub;
  });

  const input = {
    id: account.id,
    aggregateId: account.aggregateId,
    name: "AccountDeletedEvent",
    version: account.version + 1,
    data: JSON.stringify({
      id: account.id,
      name: account.name,
      description: account.description,
      accountAccountTypeId: account.accountType.id
    }),
    userId: userId,
    timestamp: new Date().toISOString()
  };
  await API.graphql(graphqlOperation(createEvent, { input }));

  dispatch({
    type: DELETE_ACCOUNT,
    payload: {
      account
    }
  });
};
