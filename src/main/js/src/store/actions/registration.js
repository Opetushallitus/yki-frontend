import * as actionTypes from './actionTypes';
import axios from '../../axios';

export const fetchExamSessions = () => {
  return dispatch => {
    dispatch(fetchExamSessionsStart());
    axios
      .get('/yki/api/exam-session')
      .then(res => {
        dispatch(extractExamLocations(res.data.exam_sessions));
        dispatch(fetchExamSessionsSuccess(res.data.exam_sessions));
        dispatch(filterAndGroupByDate());
      })
      .catch(err => {
        dispatch(fetchExamSessionsFail(err));
      });
  };
};

const extractExamLocations = array => {
  const locations = new Set();
  array.map(e => locations.add(e.location[0].address.split(' ').pop()));
  return {
    type: actionTypes.ADD_EXAM_LOCATIONS,
    locations: [...locations].sort(),
  };
};

const filterAndGroupByDate = () => {
  return {
    type: actionTypes.FILTER_AND_GROUP_BY_DATE,
  };
};

const fetchExamSessionsStart = () => {
  return {
    type: actionTypes.FETCH_EXAM_SESSIONS_START,
  };
};

const fetchExamSessionsSuccess = examSessions => {
  return {
    type: actionTypes.FETCH_EXAM_SESSIONS_SUCCESS,
    examSessions: examSessions,
  };
};

const fetchExamSessionsFail = error => {
  return {
    type: actionTypes.FETCH_EXAM_SESSIONS_FAIL,
    error: error,
  };
};

export const selectLanguage = language => {
  return dispatch => {
    dispatch(setLanguage(language));
    dispatch(filterAndGroupByDate());
  };
};

const setLanguage = language => {
  return {
    type: actionTypes.SELECT_LANGUAGE,
    language: language,
  };
};

export const selectLevel = level => {
  return dispatch => {
    dispatch(setLevel(level));
    dispatch(filterAndGroupByDate());
  };
};

const setLevel = level => {
  return {
    type: actionTypes.SELECT_LEVEL,
    level: level,
  };
};

export const selectLocation = location => {
  return dispatch => {
    dispatch(setLocation(location));
    dispatch(filterAndGroupByDate());
  };
};

const setLocation = location => {
  return {
    type: actionTypes.SELECT_LOCATION,
    location: location,
  };
};

export const selectExamSession = examSession => {
  return {
    type: actionTypes.SELECT_EXAM_SESSION,
    examSession: examSession,
  };
};

// helper for testing spinner while loading
const sleeper = ms => x =>
  new Promise(resolve => setTimeout(() => resolve(x), ms));

export const fetchExamSession = examSessionId => {
  return dispatch => {
    dispatch(fetchExamSessionStart());
    axios
      .get(`/yki/api/exam-session/${examSessionId}`)
      .then(sleeper(3000))
      .then(res => dispatch(fetchExamSessionSuccess(res.data)))
      .catch(err => dispatch(fetchExamSessionFail(err)));
  };
};

const fetchExamSessionStart = () => {
  return {
    type: actionTypes.FETCH_EXAM_SESSIONS_START,
  };
};

const fetchExamSessionSuccess = examSession => {
  return {
    type: actionTypes.FETCH_EXAM_SESSION_SUCCESS,
    examSession: examSession,
  };
};

const fetchExamSessionFail = error => {
  return {
    type: actionTypes.FETCH_EXAM_SESSION_FAIL,
    error: error,
  };
};

export const initRegistrationForm = examSessionId => {
  return dispatch => {
    dispatch(initRegistrationFormStart());
    Promise.all([
      axios.post('/yki/api/registration/init', {
        exam_session_id: Math.trunc(examSessionId),
      }),
      axios.get('/yki/api/code/maatjavaltiot2'),
      axios.get('/yki/api/code/sukupuoli'),
    ])
      .then(([init, nationalities, genders]) => {
        dispatch(
          initRegistrationFormSuccess(
            init.data,
            nationalities.data,
            genders.data,
          ),
        );
      })
      .catch(err => {
        dispatch(initRegistrationFormFail(err));
      });
  };
};

const initRegistrationFormStart = () => {
  return {
    type: actionTypes.INIT_REGISTRATION_FORM_START,
  };
};

const initRegistrationFormSuccess = (formInitData, nationalities, genders) => {
  return {
    type: actionTypes.INIT_REGISTRATION_FORM_SUCCESS,
    formInitData: Object.assign(
      formInitData,
      { nationalities: nationalities },
      { genders: genders },
    ),
  };
};

const initRegistrationFormFail = error => {
  return {
    type: actionTypes.INIT_REGISTRATION_FORM_FAIL,
    error: error.response,
  };
};

export const submitRegistrationForm = (registrationId, registrationForm) => {
  return dispatch => {
    dispatch(submitRegistrationFormStart());
    axios
      .post(`/yki/api/registration/${registrationId}/submit`, registrationForm)
      .then(res => {
        dispatch(submitRegistrationFormSuccess(registrationForm));
      })
      .catch(err => {
        dispatch(submitRegistrationFormFail(err));
      });
  };
};

const submitRegistrationFormStart = () => {
  return {
    type: actionTypes.SUBMIT_REGISTRATION_FORM_START,
  };
};

const submitRegistrationFormSuccess = registrationForm => {
  return {
    type: actionTypes.SUBMIT_REGISTRATION_FORM_SUCCESS,
    formData: registrationForm,
  };
};

const submitRegistrationFormFail = error => {
  return {
    type: actionTypes.SUBMIT_REGISTRATION_FORM_FAIL,
    error: error,
  };
};
