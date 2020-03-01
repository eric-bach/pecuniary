import { API, graphqlOperation } from "aws-amplify";
import { listPositionReadModels } from "../../graphql/queries.js";
import { FETCH_POSITIONS } from "./constants";
import { asyncActionStart, asyncActionFinish } from "../async/actions";

export const fetchPositions = accountId => async dispatch => {
  dispatch(asyncActionStart());

  var query = {
    filter: {
      aggregateId: {
        eq: accountId
      }
    }
  };

  await API.graphql(graphqlOperation(listPositionReadModels, query)).then(result => {
    const positions = result.data.listPositionReadModels.items.sort((a, b) => (a.createdDate < b.createdDate ? 1 : -1));

    dispatch({
      type: FETCH_POSITIONS,
      payload: { positions: positions }
    });
  });

  dispatch(asyncActionFinish());
};
