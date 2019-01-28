import * as actionTypes from './actionTypes';
// import axios from '../../axios';
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
