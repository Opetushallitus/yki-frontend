import * as actionTypes from './actionTypes';
import i18next from "i18next";

const setYkiLanguage = language => {
  return {
    type: actionTypes.CHANGE_YKI_LANGUAGE,
    ykiLanguage: language,
  };
};

const initYkiLanguage = () => {
  const result = i18next.language;

  return {
    type: actionTypes.INIT_YKI_LANGUAGE,
    ykiLanguage: result
  }
}

export const initYKILanguage = () => {
  return dispatch => {
    dispatch(initYkiLanguage());
  };
};

export const changeYKILanguage = language => {
  return dispatch => {
    dispatch(setYkiLanguage(language));
  };
};