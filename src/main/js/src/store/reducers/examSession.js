import * as actionTypes from '../actions/actionTypes';

const initialState = {
  examSessionContent: {
    organizer: null,
    organization: null,
    examSessions: [],
    examDates: [],
  },
  loading: false,
  error: null,
};

const reducer = (state = initialState, action) => {
  if (action.type.includes('EXAM_SESSION')) {
    switch (action.type) {
      case actionTypes.FETCH_EXAM_SESSION_CONTENT_SUCCESS:
        return {
          ...state,
          examSessionContent: action.examSessionContent,
          loading: false,
        };
      case actionTypes.ADD_EXAM_SESSION_SUCCESS:
        return {
          ...state,
          loading: false,
        };
      default:
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
