import * as R from 'ramda';

import * as actionTypes from '../actions/actionTypes';
import { LANGUAGES } from '../../common/Constants';

const initialState = {
  examSessions: [],
  filteredExamSessionsGroupedByDate: {},
  language: LANGUAGES[0],
  level: '',
  location: '',
  locations: [],
  selectedExamSession: {},
  loading: false,
  error: null,
  form: {
    initData: null,
    initDataLoading: false,
    initDataError: null,
    formData: null,
    submitResponse: null,
    submitting: false,
    submitError: null,
    submitSuccess: false,
  },
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
      const filtered = state.examSessions
        .filter(e =>
          state.location === ''
            ? true
            : e.location[0].address
                .toLowerCase()
                .endsWith(state.location.toLowerCase()),
        )
        .filter(e => (state.level === '' ? true : e.level_code === state.level))
        .filter(e => e.language_code === state.language.code);
      const groupedByDate = R.groupBy(s => s.session_date, filtered);
      const orderedByDate = {};
      Object.keys(groupedByDate)
        .sort()
        .map(k => (orderedByDate[k] = groupedByDate[k]));
      return {
        ...state,
        filteredExamSessionsGroupedByDate: orderedByDate,
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
    case actionTypes.SELECT_EXAM_SESSION:
      return {
        ...state,
        selectedExamSession: action.examSession,
      };
    case actionTypes.FETCH_EXAM_SESSION_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.FETCH_EXAM_SESSION_SUCCESS:
      return {
        ...state,
        loading: false,
        selectedExamSession: action.examSession,
      };
    case actionTypes.FETCH_EXAM_SESSION_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case actionTypes.INIT_REGISTRATION_FORM_START:
      return {
        ...state,
        form: {
          ...state.form,
          initDataLoading: true,
        },
      };
    case actionTypes.INIT_REGISTRATION_FORM_SUCCESS:
      return {
        ...state,
        form: {
          ...state.form,
          initDataLoading: false,
          initData: action.formInitData,
        },
      };
    case actionTypes.INIT_REGISTRATION_FORM_FAIL:
      return {
        ...state,
        form: {
          ...state.form,
          initDataLoading: false,
          initDataError: action.error,
        },
      };
    case actionTypes.SUBMIT_REGISTRATION_FORM_START:
      return {
        ...state,
        form: {
          ...state.form,
          submitting: true,
        },
      };
    case actionTypes.SUBMIT_REGISTRATION_FORM_SUCCESS:
      return {
        ...state,
        form: {
          ...state.form,
          submitting: false,
          submitError: null,
          formData: action.formData,
          submitSuccess: true,
          submitResponse: action.formSubmitResponse,
        },
      };
    case actionTypes.SUBMIT_REGISTRATION_FORM_FAIL:
      return {
        ...state,
        form: {
          ...state.form,
          submitting: false,
          submitError: action.error,
        },
      };
    default:
      return state;
  }
};

export default reducer;
