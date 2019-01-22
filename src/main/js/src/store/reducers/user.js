import * as actionTypes from '../actions/actionTypes';

const initialState = {
  user: null,
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
      return {
        ...state,
        user: action.user,
        loading: false,
      };
    case actionTypes.FETCH_USER_FAIL:
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
