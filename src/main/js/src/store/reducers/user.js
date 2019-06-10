import * as actionTypes from '../actions/actionTypes';

const initialState = {
  user: null,
  loading: false,
  error: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_USER_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.FETCH_USER_SUCCESS:
      console.log("ok: ", action.user);
      return {
        ...state,
        user: action.user,
        loading: false,
      };
    case actionTypes.FETCH_USER_FAIL:
      console.log("fail: ", action.error);
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    default:
      return state;
  }
};

export default reducer;
