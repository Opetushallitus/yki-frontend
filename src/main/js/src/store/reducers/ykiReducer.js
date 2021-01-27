import * as actionTypes from '../actions/actionTypes';

const initialState = {
  ykiLanguage: null
}

const ykiReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INIT_YKI_LANGUAGE:
      return {
        ...state,
        ykiLanguage: action.ykiLanguage,
      }
    case actionTypes.CHANGE_YKI_LANGUAGE:
      return {
        ...state,
        ykiLanguage: action.ykiLanguage
      }
    default:
      return state;
  }
}

export default ykiReducer;
