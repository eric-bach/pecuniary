import { Auth } from "aws-amplify";
import { SIGN_IN, SIGN_OUT } from "./authConstants";
import { asyncActionStart, asyncActionFinish } from "../Async/asyncActions.js";

export const signIn = () => async dispatch => {
  dispatch(asyncActionStart());

  await Auth.currentUserInfo().then(user => {
    dispatch({
      type: SIGN_IN,
      payload: {
        user: user,
        authenticated: true
      }
    });
  });

  dispatch(asyncActionFinish());
};

export const signOut = () => async dispatch => {
  dispatch(asyncActionStart());

  await Auth.signOut()
    .then(
      dispatch({
        type: SIGN_OUT
      })
    )
    .catch(err => console.log(err));

  dispatch(asyncActionFinish());
};
