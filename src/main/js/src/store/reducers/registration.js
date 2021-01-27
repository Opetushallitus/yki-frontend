import * as R from 'ramda';

import * as actionTypes from '../actions/actionTypes';
import {ISO_DATE_FORMAT_SHORT, LANGUAGES} from '../../common/Constants';
import moment from "moment";

const initialState = {
  examSessions: [],
  filteredExamSessionsGroupedByDate: {},
  filteredExamSessionsByAvailability: {},
  filteredExamSessionsByOpenRegistration: {},
  filteredExamsByAvailabilityAndRegistration: {},
  language: LANGUAGES[0],
  level: '',
  location: '',
  locations: [],
  examSession: {},
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

const filteredSessions = (state) => {
  return state.examSessions
      .filter(e =>
          state.location === ''
              ? true
              : e.location[0].post_office
                  .toLowerCase()
                  .endsWith(state.location.toLowerCase()),
      )
      .filter(e => (state.level === '' ? true : e.level_code === state.level))
      .filter(e => e.language_code === state.language.code);
}

const currentDate = moment().format(ISO_DATE_FORMAT_SHORT);

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
      const filtered = filteredSessions(state);
      const groupedByDate = R.groupBy(R.prop('session_date'), filtered);
      const orderedByDate = {};
      Object.keys(groupedByDate)
        .sort()
        .map(k => (orderedByDate[k] = groupedByDate[k]));
      return {
        ...state,
        filteredExamSessionsGroupedByDate: orderedByDate,
      };

    case actionTypes.FILTER_BY_AVAILABILITY:
      const filteredExams = filteredSessions(state);
      let filteredArray = [];

      for (let i in filteredExams) {
        const item = filteredExams[i];
        const isOpen = moment(item.registration_end_date).isAfter(currentDate);
        if (isOpen && item.participants < item.max_participants) {
          filteredArray.push(item);
        }
      }

      const groupedAvailableSessions = R.groupBy(R.prop('session_date'), filteredArray);
      let availableExams = {};

      Object.keys(groupedAvailableSessions)
          .sort()
          .map(k => (availableExams[k] = groupedAvailableSessions[k]));

      return {
        ...state,
        filteredExamSessionsByAvailability: availableExams
      }

    case actionTypes.FILTER_BY_OPEN_REGISTRATION:
      const filteredExamsForOpens = filteredSessions(state);
      let filteredOpenExams = [];

      for (let i in filteredExamsForOpens) {
        const item = filteredExamsForOpens[i];

        const registrationOpen = moment(item.registration_end_date).isAfter(currentDate);
        const registrationStarted = moment(item.registration_start_date).isSameOrBefore(currentDate);

        if (registrationOpen && registrationStarted && !item.queue_full) {
          filteredOpenExams.push(item);
        }
      }

      const groupedOpenSessions = R.groupBy(R.prop('session_date'), filteredOpenExams);
      let openRegistration = {};

      Object.keys(groupedOpenSessions)
          .sort()
          .map(k => (openRegistration[k] = groupedOpenSessions[k]));

      return {
        ...state,
        filteredExamSessionsByOpenRegistration: openRegistration
      }

    case actionTypes.FILTER_BY_AVAILABILITY_AND_REGISTRATION:
      const filteredExamData = filteredSessions(state);

      let filteredAvailable = [];
      for (let i in filteredExamData) {
        const item = filteredExamData[i];
        if (item.registration_start_date <= currentDate && item.registration_end_date >= currentDate && !item.queue_full) {
          filteredAvailable.push(item);
        }
      }

      let filteredAvailableAndOpen = []

      for (let i in filteredAvailable) {
        const item = filteredAvailable[i];
        if (item.participants < item.max_participants) {
          filteredAvailableAndOpen.push(item);
        }
      }

      const filteredExamsByAvailabilityAndRegistration = {};
      const groupedData = R.groupBy(R.prop('session_date'), filteredAvailableAndOpen);

      Object.keys(groupedData)
          .sort()
          .map(k => (filteredExamsByAvailabilityAndRegistration[k] = groupedData[k]));

      return {
        ...state,
        filteredExamsByAvailabilityAndRegistration: filteredExamsByAvailabilityAndRegistration,
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
        examSession: action.examSession,
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
        examSession: action.examSession,
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
          submitError: action.error.response,
        },
      };
    default:
      return state;
  }
};

export default reducer;
