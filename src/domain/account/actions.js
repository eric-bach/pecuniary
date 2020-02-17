import { API, graphqlOperation, Auth } from "aws-amplify";
import { createEvent } from "../../graphql/mutations";
import { listAccountReadModels } from "../../graphql/queries.js";
import { FETCH_ACCOUNTS, UPDATE_ACCOUNT } from "./constants";
import { asyncActionStart, asyncActionFinish } from "../async/actions";

export const fetchAccounts = userId => async dispatch => {
  dispatch(asyncActionStart());

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
      accountAccountTypeId: account.accountTypeId
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
