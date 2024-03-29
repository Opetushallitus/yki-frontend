import * as actionTypes from '../actions/actionTypes';

const initialState = {
  loading: false,
  confirm: null,
  error: null,
  matches: [],
  reviews: [],
  quarantines: [],
  showAddModal: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.RESET_QUARANTINE:
      return { ...initialState };
    case actionTypes.LOADING_QUARANTINE:
      return { ...state, loading: action.loading };
    case actionTypes.ADD_QUARANTINE_MATCHES:
      return { ...state, matches: action.matches };
    case actionTypes.ADD_QUARANTINE_REVIEWS:
      return { ...state, reviews: action.reviews };
    case actionTypes.ADD_QUARANTINES:
      return { ...state, quarantines: action.quarantines };
    case actionTypes.CONFIRM_QUARANTINE:
      return { ...state, confirm: action.confirm };
    case actionTypes.SHOW_ADD_QUARANTINE:
      return { ...state, showAddModal: action.showAddModal };
    case actionTypes.SET_QUARANTINE_FAIL:
    case actionTypes.FETCH_QUARANTINE_MATCHES_FAIL:
      return { ...state, error: action.error };
    default:
      return state;
  }
}

export default reducer;
