import * as actionTypes from './actionTypes';
import axios from '../../axios';
import i18next from 'i18next';

import { firstCharToUpper } from '../../util/util';

export const fetchExamSessions = () => {
  return dispatch => {
    dispatch(fetchExamSessionsStart());
    axios
      .get('/yki/api/exam-sessions')
      .then(res => {
        dispatch(extractExamLocations(res.data.exam_sessions));
        dispatch(fetchExamSessionsSuccess(res.data.exam_sessions));
        const dates = new Set();
        res.data.exam_sessions.map(e => dates.add(e.session_date));
        dispatch(
          groupExamSessionsByDate([...dates].sort(), res.data.exam_sessions),
        );
      })
      .catch(err => {
        console.log(err);
        dispatch(fetchExamSessionsFail(err));
      });
  };
};

const extractExamLocations = array => {
  const extracted = new Set();
  array.map(e => extracted.add(e.location[0].address.split(' ').pop()));
  const locations = [
    i18next.t('common.location.all'),
    ...[...extracted].sort(),
  ];
  return {
    type: actionTypes.ADD_EXAM_LOCATIONS,
    locations: locations,
  };
};

const groupExamSessionsByDate = (dates, examSessions) => {
  const examSessionsGroupedByDate = {};
  dates.map(
    d =>
      (examSessionsGroupedByDate[d] = examSessions.filter(
        e => e.session_date === d,
      )),
  );
  return {
    type: actionTypes.ADD_EXAM_SESSIONS_GROUPED_BY_DATE,
    examSessionsGroupedByDate: examSessionsGroupedByDate,
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
  return {
    type: actionTypes.SELECT_LANGUAGE,
    language: language,
  };
};

export const selectLevel = level => {
  return {
    type: actionTypes.SELECT_LEVEL,
    level: level,
  };
};

export const selectLocation = location => {
  return {
    type: actionTypes.SELECT_LOCATION,
    location: location,
  };
};

export const setDefaultFilters = () => {
  return {
    type: actionTypes.SET_DEFAULT_FILTERS,
    language: firstCharToUpper(i18next.t('common.language.fin')),
    level: i18next.t('common.level.all'),
    location: i18next.t('common.location.all'),
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
