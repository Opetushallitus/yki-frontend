import * as actionTypes from './actionTypes';
import axios from '../../axios';
import i18next from 'i18next';

import { firstCharToUpper } from '../../util/util';

export const fetchExamLocations = () => {
  const locations = ['Pernäjä', 'Hämeenlinna', 'Jämsä', 'Korso', 'Ankkalinna'];
  return dispatch => {
    dispatch(fetchExamLocationsStart());
    // TODO: get actual locations from api
    // axios.get('/yki/api/exam-sessions')
    dispatch(fetchExamLocationsSuccess(locations));
  };
};

const fetchExamLocationsStart = () => {
  return {
    type: actionTypes.FETCH_EXAM_LOCATIONS_START,
  };
};

const fetchExamLocationsSuccess = locations => {
  return {
    type: actionTypes.FETCH_EXAM_LOCATIONS_SUCCESS,
    locations: [i18next.t('common.location.all'), ...locations.sort()],
  };
};

// const fetchExamLocationsFail = error => {
//   return {
//     type: actionTypes.FETCH_EXAM_LOCATIONS_FAIL,
//     error: error,
//   };
// };

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
