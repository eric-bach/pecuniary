import { FETCH_TIME_SERIES } from "./constants";
import { createReducer } from "../../common/reducerUtils";

const INITIAL_STATE = {
  timeSeries: []
};

const fetchTimeSeries = (state, payload) => {
  return { ...state, timeSeries: [...state.timeSeries, payload] };
};

export default createReducer(INITIAL_STATE, {
  [FETCH_TIME_SERIES]: fetchTimeSeries
});
