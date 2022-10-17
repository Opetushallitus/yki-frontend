import * as actionTypes from '../actions/actionTypes';

const initialState = {
  startDate: null,
  endDate: null,
  loading: false,
  error: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_PAYMENTS_REPORT_START:
      return {...state, error: null, loading: true };
    case actionTypes.FETCH_PAYMENTS_REPORT_SUCCESS:
      return {...state, loading: false};
    case actionTypes.FETCH_PAYMENTS_REPORT_FAIL:
      return {...state, loading: false, error: action.error };
    case actionTypes.FETCH_PAYMENTS_REPORT_RESET:
      return initialState;
    default: 
      return state;
  }
}

export default reducer;