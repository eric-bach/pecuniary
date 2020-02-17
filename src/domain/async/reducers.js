import { ASYNC_ACTION_START, ASYNC_ACTION_FINISH, ASYNC_ACTION_ERROR } from "./constants";
import { createReducer } from "../../common/reducerUtils";

const INITIAL_STATE = {
  loading: false
};

const asyncActionStarted = (state, payload) => {
  return {
    ...state,
    loading: true
  };
};

const asyncActionFinished = state => {
  return {
    ...state,
    loading: false
  };
};

const asyncActionError = state => {
  return {
    ...state,
    loading: false
  };
};

export default createReducer(INITIAL_STATE, {
  [ASYNC_ACTION_START]: asyncActionStarted,
  [ASYNC_ACTION_FINISH]: asyncActionFinished,
  [ASYNC_ACTION_ERROR]: asyncActionError
});
