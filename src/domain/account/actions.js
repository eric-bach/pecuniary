import { API, graphqlOperation, Auth } from "aws-amplify";
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

export const updateAccount = account => {
  return {
    type: UPDATE_ACCOUNT,
    payload: account
  };
};
