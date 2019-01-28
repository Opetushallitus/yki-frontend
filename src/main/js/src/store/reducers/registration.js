import * as actionTypes from '../actions/actionTypes';

const initialState = {
  language: '',
  level: '',
  location: '',
  locations: [],
  loading: false,
  error: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_EXAM_LOCATIONS_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.FETCH_EXAM_LOCATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        locations: action.locations,
      };
    case actionTypes.FETCH_EXAM_LOCATIONS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
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
    case actionTypes.SELECT_LOCATION:
      return {
        ...state,
        location: action.location,
      };
    case actionTypes.SET_DEFAULT_FILTERS:
      return {
        ...state,
        language: action.language,
        level: action.level,
        location: action.location,
      };
    default:
      return state;
  }
};

export default reducer;
