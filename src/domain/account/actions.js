import { API, graphqlOperation, Auth } from "aws-amplify";
import { createEvent } from "../../graphql/mutations";
import { listAccountTypes, listAccountReadModels } from "../../graphql/queries.js";
import { FETCH_ACCOUNTS, CREATE_ACCOUNT, UPDATE_ACCOUNT, FETCH_ACCOUNT_TYPES, DELETE_ACCOUNT } from "./constants";
import { asyncActionStart, asyncActionFinish } from "../async/actions";

export const fetchAccounts = (currentToken, nextToken) => async dispatch => {
  dispatch(asyncActionStart());

  var userId;
  await Auth.currentUserInfo().then(user => {
    userId = user.attributes.sub;
  });

  var query;
  if (nextToken) {
    query = {
      filter: {
        userId: {
          eq: userId
        }
      },
      nextToken: nextToken
    };
  } else {
    query = {
      filter: {
        userId: {
          eq: userId
        }
      }
    };
  }

  // Set prevToken to current Token
  currentToken = nextToken;

  await API.graphql(graphqlOperation(listAccountReadModels, query)).then(result => {
    const accounts = result.data.listAccountReadModels.items.sort((a, b) => (a.createdDate < b.createdDate ? 1 : -1));
    const nextToken = result.data.listAccountReadModels.nextToken;

    dispatch({
      type: FETCH_ACCOUNTS,
      payload: { accounts: accounts, prevToken: currentToken, nextToken: nextToken }
    });
  });

  dispatch(fetchAccountTypes());

  dispatch(asyncActionFinish());
};

export const fetchAccountTypes = () => async dispatch => {
  await API.graphql(graphqlOperation(listAccountTypes)).then(result => {
    const accountTypes = result.data.listAccountTypes.items;

    dispatch({ type: FETCH_ACCOUNT_TYPES, payload: accountTypes });
  });
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
      bookValue: 0,
      marketValue: 0,
      accountAccountTypeId: account.accountType.id,
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString()
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
      bookValue: account.bookValue,
      marketValue: account.marketValue,
      accountAccountTypeId: account.accountType.id,
      updatedDate: new Date().toISOString()
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
