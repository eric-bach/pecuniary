import { SIGN_IN, SIGN_OUT } from "./constants";
import { createReducer } from "../../common/reducerUtils";

const INITIAL_STATE = {
  user: null,
  authenticated: false
};

const signIn = (state, payload) => {
  return {
    ...state,
    user: payload.user,
    authenticated: payload.authenticated
  };
};

const signOut = state => {
  return {
    ...state,
    user: null,
    authenticated: false
  };
};

export default createReducer(INITIAL_STATE, {
  [SIGN_IN]: signIn,
  [SIGN_OUT]: signOut
});
