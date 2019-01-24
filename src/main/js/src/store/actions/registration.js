import * as actionTypes from './actionTypes';

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
