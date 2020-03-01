import { FETCH_POSITIONS } from "./constants";
import { createReducer } from "../../common/reducerUtils";

const INITIAL_STATE = {
  positions: []
};

const fetchPositions = (state, payload) => {
  return { ...state, positions: payload.positions };
};

export default createReducer(INITIAL_STATE, {
  [FETCH_POSITIONS]: fetchPositions
});
