import * as actionTypes from '../actions/actionTypes';

const initialState = {
  lang: 'fi',
  translations: {},
  loading: false,
  error: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_TRANSLATIONS_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.FETCH_TRANSLATIONS_SUCCESS:
      return {
        ...state,
        translations: action.translations,
        loading: false,
      };
    case actionTypes.FETCH_TRANSLATIONS_FAIL:
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    case actionTypes.SET_LANG:
      return {
        ...state,
        lang: action.lang,
      };
    default:
      return state;
  }
};

export default reducer;
