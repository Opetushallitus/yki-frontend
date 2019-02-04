import * as actionTypes from './actionTypes';
import axios from '../../axios';

export const fetchExamSessions = () => {
  return dispatch => {
    dispatch(fetchExamSessionsStart());
    axios
      .get('/yki/api/exam-sessions')
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

export const initRegistrationForm = examSessionId => {
  return dispatch => {
    dispatch(initRegistrationFormStart());
    axios
      .post(`/yki/api/registration/init`, { exam_session_id: Math.trunc(examSessionId) })
      .then(res => {
        dispatch(initRegistrationFormSuccess(res.data));
      })
      .catch(err => {
        dispatch(initRegistrationFormFail(err));
      });
  };
};

const initRegistrationFormStart = () => {
  return {
    type: actionTypes.INIT_REGISTRATION_FORM_START,
    loading: true,
  };
};

const initRegistrationFormSuccess = formInitData => {
  return {
    type: actionTypes.INIT_REGISTRATION_FORM_SUCCESS,
    formInitData: formInitData,
    loading: false,
  };
};

const initRegistrationFormFail = error => {
  return {
    type: actionTypes.INIT_REGISTRATION_FORM_FAIL,
    error: error,
    loading: false,
  };
};
