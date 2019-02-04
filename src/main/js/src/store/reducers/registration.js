import * as actionTypes from '../actions/actionTypes';
import { LANGUAGES } from '../../common/Constants';

const initialState = {
  examSessions: [],
  filteredExamSessionsGroupedByDate: {},
  language: LANGUAGES[0],
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
    case actionTypes.FILTER_AND_GROUP_BY_DATE:
      const filteredByLocation = state.examSessions.filter(e => {
        if (state.location === '') {
          return true;
        } else {
          return e.location[0].address
            .toLowerCase()
            .endsWith(state.location.toLowerCase());
        }
      });
      const filteredByLevel = filteredByLocation.filter(e => {
        if (state.level === '') {
          return true;
        } else {
          return e.level_code === state.level;
        }
      });
      const filteredByLanguage = filteredByLevel.filter(
        e => e.language_code === state.language.code,
      );
      const dates = new Set();
      filteredByLanguage.map(e => dates.add(e.session_date));
      const examSessionsGroupedByDate = {};
      [...dates]
        .sort()
        .map(
          d =>
            (examSessionsGroupedByDate[d] = filteredByLanguage.filter(
              e => e.session_date === d,
            )),
        );
      return {
        ...state,
        filteredExamSessionsGroupedByDate: examSessionsGroupedByDate,
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
