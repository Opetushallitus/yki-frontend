import * as actionTypes from '../actions/actionTypes';

const initialState = {
  examSessionContent: {
    organizer: null,
    organization: null,
    examSessions: [],
  },
  loading: false,
  error: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_EXAM_SESSION_CONTENT_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.FETCH_EXAM_SESSION_CONTENT_SUCCESS:
      return {
        ...state,
        examSessionContent: action.examSessionContent,
        loading: false,
      };
    case actionTypes.FETCH_EXAM_SESSION_CONTENT_FAIL:
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    case actionTypes.FETCH_EXAM_SESSION_CONTENT_FAIL_RESET:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export default reducer;
