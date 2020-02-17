import { FETCH_ACCOUNTS } from "./constants";

const INITIAL_STATE = {
  accounts: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_ACCOUNTS:
      return { ...state, accounts: action.payload };
    default:
      return state;
  }
};
