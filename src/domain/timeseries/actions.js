import { API, graphqlOperation } from "aws-amplify";
import { FETCH_TIME_SERIES } from "./constants";
import { asyncActionStart, asyncActionFinish } from "../async/actions";
import { listTimeSeriess } from "../../graphql/queries";

export const fetchTimeSeries = transaction => async dispatch => {
  dispatch(asyncActionStart());

  var query = {
    filter: {
      symbol: {
        eq: transaction.symbol
      }
      // date: {
      //   eq: new Date(transaction.transactionDate).toISOString().substring(0, 10)
      // }
    }
  };

  await API.graphql(graphqlOperation(listTimeSeriess, query)).then(result => {
    const timeSeries = result.data.listTimeSeriess.items;

    dispatch({
      type: FETCH_TIME_SERIES,
      payload: { timeSeries: timeSeries }
    });
  });

  dispatch(asyncActionFinish());
};
