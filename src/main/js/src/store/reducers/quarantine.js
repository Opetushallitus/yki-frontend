import * as actionTypes from '../actions/actionTypes';

const initialState = {
  loading: false,
  error: null,
  matches: [],
  all: [],
  quarantines: [],
  showAddModal: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_QUARANTINE_MATCHES:
      return { ...state, matches: action.matches, all: action.all };
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
