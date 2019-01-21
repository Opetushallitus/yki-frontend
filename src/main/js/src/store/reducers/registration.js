import * as actionTypes from '../actions/actionTypes';

const initialState = {
  language: '',
  level: '',
  area: '',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SELECT_LANGUAGE:
      return {
        ...state,
        language: action.language,
      };
    case actionTypes.SELECT_LEVEL:
      return {
        ...state,
        level: action.level,
      };
    case actionTypes.SELECT_AREA:
      return {
        ...state,
        area: action.area,
      };
    default:
      return state;
  }
};

export default reducer;
