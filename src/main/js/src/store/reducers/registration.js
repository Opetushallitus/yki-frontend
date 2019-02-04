import * as actionTypes from '../actions/actionTypes';

const initialState = {
  examSessions: [],
  examSessionsGroupedByDate: {},
  language: '',
  level: '',
  location: '',
  locations: [],
  formInitData: null,
  loading: false,
  error: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_EXAM_SESSIONS_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.FETCH_EXAM_SESSIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        examSessions: action.examSessions,
      };
    case actionTypes.FETCH_EXAM_SESSIONS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case actionTypes.ADD_EXAM_SESSIONS_GROUPED_BY_DATE:
      return {
        ...state,
        examSessionsGroupedByDate: action.examSessionsGroupedByDate,
      };
    case actionTypes.ADD_EXAM_LOCATIONS:
      return {
        ...state,
        locations: action.locations,
      };
    case actionTypes.SELECT_LANGUAGE:
      return {
        ...state,
        language: action.language,
      };
    case actionTypes.SELECT_LEVEL:
      return {
        ...state,
        level: action.level,
      };
    case actionTypes.SELECT_LOCATION:
      return {
        ...state,
        location: action.location,
      };
    case actionTypes.SET_DEFAULT_FILTERS:
      return {
        ...state,
        language: action.language,
        level: action.level,
        location: action.location,
      };
    case actionTypes.INIT_REGISTRATION_FORM_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.INIT_REGISTRATION_FORM_SUCCESS:
      return {
        ...state,
        loading: false,
        formInitData: action.formInitData,
      };
    case actionTypes.INIT_REGISTRATION_FORM_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    default:
      return state;
  }
};

export default reducer;
