import * as actionTypes from '../actions/actionTypes';

const initialState = {
  examDates: [],
  loading: false,
  error: null,
};

const reducer = (state = initialState, action) => {
  if (action.type.includes('EXAM_DATE')) {
    switch (action.type) {
      case actionTypes.FETCH_EXAM_DATES_START:
        return {
          ...state,
          loading: true,
        };
      case actionTypes.FETCH_EXAM_DATES_SUCCESS:
        return {
          ...state,
          examDates: action.examDates,
          loading: false,
        };
      case actionTypes.FETCH_EXAM_DATES_FAIL:
        return {
          ...state,
          error: action.error,
          loading: false,
        };
      default:
        if (action.type.endsWith('_SUCCESS')) {
          return {
            ...state,
            loading: false,
          };
        }
        if (action.type.endsWith('_START')) {
          return {
            ...state,
            loading: true,
          };
        }
        if (action.type.endsWith('_FAIL_RESET')) {
          return {
            ...state,
            error: null,
          };
        } else if (action.type.endsWith('_FAIL')) {
          return {
            ...state,
            error: action.error,
            loading: false,
          };
        } else {
          return state;
        }
    }
  } else {
    return state;
  }
};

export default reducer;
