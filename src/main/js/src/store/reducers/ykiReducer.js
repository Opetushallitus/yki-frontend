import * as actionTypes from '../actions/actionTypes';

const initialState = {
  ykiLanguage: null,
  windowWidth: 1700,
};

const ykiReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INIT_YKI_LANGUAGE:
      return {
        ...state,
        ykiLanguage: action.ykiLanguage,
      };
    case actionTypes.CHANGE_YKI_LANGUAGE:
      return {
        ...state,
        ykiLanguage: action.ykiLanguage,
      };
    case actionTypes.SET_WINDOW_WIDTH:
      return {
        ...state,
        windowWidth: action.windowWidth,
      };

    default:
      return state;
  }
};

export default ykiReducer;
