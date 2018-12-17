import * as actionTypes from './actionTypes';
import axios from '../../axios';

export const fetchTranslations = () => {
  return dispatch => {
    dispatch(fetchTranslationsStart());
    axios
      .get(
        '/yki/api/localisation',
      )
      .then(res => {
        dispatch(fetchTranslationsSuccess(res.data));
      })
      .catch(err => {
        dispatch(fetchTranslationsFail(err));
      });
  };
};

export const setLang = (lang) => {
  return {
    type: actionTypes.SET_LANG,
    lang: lang,
  };
}

const fetchTranslationsStart = () => {
  return {
    type: actionTypes.FETCH_TRANSLATIONS_START,
    loading: true,
  };
};

const fetchTranslationsSuccess = translations => {
  return {
    type: actionTypes.FETCH_TRANSLATIONS_SUCCESS,
    translations: translations,
    loading: false,
  };
};

const fetchTranslationsFail = error => {
  return {
    type: actionTypes.FETCH_TRANSLATIONS_FAIL,
    error: error,
    loading: false,
  };
};
