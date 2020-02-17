import { API, graphqlOperation, Auth } from "aws-amplify";
import { listAccountReadModels } from "../../graphql/queries.js";
import { FETCH_ACCOUNTS } from "./accountTypes";
import { asyncActionStart, asyncActionFinish } from "../Async/asyncActions.js";

export const fetchAccounts = userId => async dispatch => {
  dispatch(asyncActionStart());

  await Auth.currentUserInfo().then(user => {
    userId = user.attributes.sub;
  });

  let accounts;
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
    accounts = result.data.listAccountReadModels.items.sort((a, b) => (a.createdDate < b.createdDate ? 1 : -1));
  });

  dispatch({
    type: FETCH_ACCOUNTS,
    payload: accounts
  });

  dispatch(asyncActionFinish());
};
