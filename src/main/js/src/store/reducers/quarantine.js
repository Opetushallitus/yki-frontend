import * as actionTypes from '../actions/actionTypes';

const initialState = {
  loading: false,
  error: null,
  matches: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_QUARANTINE_MATCHES:
      return { ...initialState, matches: action.matches };
    case actionTypes.CONFIRM_QUARANTINE:
      return { ...state, confirm: action.confirm };
    default:
      return state;
  }
}

export default reducer;
