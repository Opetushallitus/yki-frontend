import moment from 'moment';

import { ISO_DATE_FORMAT_SHORT, LANGUAGES } from '../../common/Constants';
import {
  admissionActiveAndQueueNotFull,
  signupPossible,
} from '../../util/examSessionUtil';
import * as actionTypes from '../actions/actionTypes';

const initialState = {
  examSessions: [],
  filteredExamSessionsGroupedByDate: [],
  filteredExamSessionsByAvailability: [],
  filteredExamSessionsByOpenRegistration: [],
  filteredExamsByAvailabilityAndRegistration: [],
  language: LANGUAGES[0],
  level: '',
  location: '',
  locations: [],
  examSession: {},
  loading: false,
  error: null,
  availabilityFilter: false,
  openRegistrationFilter: false,
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
  prices: {},
  loadingPrices: false,
  evaluationPeriods: [],
  evaluationPeriod: {},
  evaluationOrderId: null,
};

const filteredSessions = (state) => {
  const filteredSessions = state.examSessions
    .filter(e =>
      state.location === ''
        ? true
        : e.location[0].post_office
          .toLowerCase()
          .endsWith(state.location.toLowerCase()),
    )
    .filter(e => (state.level === '' ? true : e.level_code === state.level))
    .filter(e => e.language_code === state.language.code);
  return filteredSessions;
}

const sortSessionsByDate = (sessionA, sessionB) => {
  const sessionDateA = moment(sessionA.session_date);
  const sessionDateB = moment(sessionB.session_date);

  if (sessionDateA.isAfter(sessionDateB)) {
    return 1;
  }
  if (sessionDateB.isAfter(sessionDateA)) {
    return -1;
  }
  return 0;
};

const sortSessionsByOpenSignups = (sessionA, sessionB) => {
  const isOpenA = signupPossible(sessionA);
  const isOpenB = signupPossible(sessionB);
  const queueSpaceA = admissionActiveAndQueueNotFull(sessionA);
  const queueSpaceB = admissionActiveAndQueueNotFull(sessionB);

  if (isOpenA && !isOpenB) {
    return -1;
  }
  if (!isOpenA && isOpenB) {
    return 1;
  }
  if (queueSpaceA && !queueSpaceB) {
    return -1;
  }
  if (!queueSpaceA && queueSpaceB) {
    return 1;
  }
  return 0;
};

const sortSessions = sessions => {
  if (!sessions || sessions.length === 0) return [];
  sessions.sort(sortSessionsByDate);
  sessions.sort(sortSessionsByOpenSignups);
  return sessions;
}

const getStateFilteredByAvailalbility = state => {
  const filteredExams = filteredSessions(state);
  let filteredArray = [];

  for (let i in filteredExams) {
    const item = filteredExams[i];

    // Not open yet or opening today, filter in spots left
    if (moment(item.registration_start_date).isSameOrAfter(currentDate)) {
      if (item.participants < item.max_participants) {
        filteredArray.push(item);
      }
    }

    else if (item.open && !item.queue_full) {
      // Check if admission or post admission. Filter in the corresponding spots
      if (moment(item.registration_end_date).isSameOrAfter(currentDate)) {
        if (item.participants < item.max_participants) {
          filteredArray.push(item);
        }
      } else if (item.post_admission_end_date && moment(item.post_admission_end_date).isSameOrAfter(currentDate)) {
        if (item.post_admission_quota && (item.pa_participants < item.post_admission_quota)) {
          filteredArray.push(item);
        }
      }
    }
  }
  return {
    ...state,
    filteredExamSessionsByAvailability: sortSessions(filteredArray)
  }
}

const getStateFilteredByOpenRegistration = state => {
  const filteredExamsForOpens = filteredSessions(state);
  let filteredOpenExams = [];

  for (let i in filteredExamsForOpens) {
    const item = filteredExamsForOpens[i];

    if (item.open && !item.queue_full) {
      filteredOpenExams.push(item);
    }
  }

  return {
    ...state,
    filteredExamSessionsByOpenRegistration: sortSessions(filteredOpenExams)
  }
}

const getStateFilteredByAvailabilityAndRegistration = state => {
  const filteredExamData = filteredSessions(state);

  let filteredAvailableAndOpen = []

  for (let i in filteredExamData) {
    const item = filteredExamData[i];
    if (item.open && !item.queue_full) {
      if (moment(item.registration_end_date).isSameOrAfter(currentDate)) {
        if (item.participants < item.max_participants) {
          filteredAvailableAndOpen.push(item);
        }
      } else if (item.post_admission_end_date && moment(item.post_admission_end_date).isSameOrAfter(currentDate)) {
        if (item.post_admission_quota && (item.pa_participants < item.post_admission_quota)) {
          filteredAvailableAndOpen.push(item);
        }
      }
    }
  }


  return {
    ...state,
    filteredExamsByAvailabilityAndRegistration: sortSessions(filteredAvailableAndOpen),
  };
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
        examSessions: sortSessions(action.examSessions),
      };

    case actionTypes.FETCH_EXAM_SESSIONS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    case actionTypes.FILTER_AND_GROUP_BY_DATE:
      const filtered = filteredSessions(state);
      return {
        ...state,
        filteredExamSessionsGroupedByDate: filtered,
      };
    case actionTypes.FETCH_PRICES_START:
      return {
        ...state,
        loadingPrices: true,
      };
    case actionTypes.FETCH_PRICES_SUCCESS:
      return {
        ...state,
        loadingPrices: false,
        prices: action.prices,
      };
    case actionTypes.FETCH_PRICES_FAIL: {
      return {
        ...state,
        loadingPrices: false,
        error: action.error,
      };
    }
    case actionTypes.FETCH_REEVALUATION_PERIODS_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.FETCH_REEVALUATION_PERIODS_SUCCESS:
      return {
        ...state,
        loading: false,
        evaluationPeriods: action.evaluationPeriods.evaluation_periods,
      };
    case actionTypes.FETCH_REEVALUATION_PERIODS_FAIL: {
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    }
    case actionTypes.FETCH_REEVALUATION_PERIOD_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.FETCH_REEVALUATION_PERIOD_SUCCESS:
      return {
        ...state,
        loading: false,
        evaluationPeriod: action.evaluationPeriod,
      };
    case actionTypes.FETCH_REEVALUATION_PERIOD_FAIL: {
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    }

    case actionTypes.CHANGE_SESSION_SELECTOR:
      const allFiltered = filteredSessions(state);
      if (state.availabilityFilter && state.openRegistrationFilter) {
        return getStateFilteredByAvailabilityAndRegistration(state);
      }
      if (state.availabilityFilter) {
        return getStateFilteredByAvailalbility(state);
      }
      if (state.openRegistrationFilter) {
        return getStateFilteredByOpenRegistration(state);
      }
      return {
        ...state,
        filteredExamSessionsGroupedByDate: allFiltered,
      }

    case actionTypes.FILTER_BY_AVAILABILITY:
      return getStateFilteredByAvailalbility(state);

    case actionTypes.FILTER_BY_OPEN_REGISTRATION:
      return getStateFilteredByOpenRegistration(state);

    case actionTypes.FILTER_BY_AVAILABILITY_AND_REGISTRATION:
      return getStateFilteredByAvailabilityAndRegistration(state);

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
    case actionTypes.TOGGLE_OPEN_REGISTRATION_FILTER:
      return {
        ...state,
        openRegistrationFilter: action.openRegistrationFilter
      }
    case actionTypes.TOGGLE_AVAILABILITY_FILTER:
      return {
        ...state,
        availabilityFilter: action.availabilityFilter
      }
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
    case actionTypes.SUBMIT_EVALUATION_FORM_START:
      return {
        ...state,
        loading: true,
        evaluationOrderId: null,
        error: null,
      };
    case actionTypes.SUBMIT_EVALUATION_FORM_SUCCESS:
      return {
        ...state,
        evaluationOrderId: action.evaluationOrderId,
        loading: false,
        error: null,
      };
    case actionTypes.SUBMIT_EVALUATION_FORM_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case actionTypes.SUBMIT_EVALUATION_FORM_FAIL_RESET:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export default reducer;
