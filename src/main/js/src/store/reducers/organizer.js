import * as actionTypes from '../actions/actionTypes';

const initialState = {
  localization: 'fi',
  organizerRegistry: [],
  loading: false,
  organizations: [],
  loadingOrganizations: false,
  error: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_ORGANIZER_REGISTRY_CONTENT_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.FETCH_ORGANIZER_REGISTRY_CONTENT_SUCCESS:
      return {
        ...state,
        organizerRegistry: action.organizerRegistry,
        loading: false,
      };
    case actionTypes.FETCH_ORGANIZER_REGISTRY_CONTENT_FAIL:
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    case actionTypes.FETCH_ORGANIZATIONS_START:
      return {
        ...state,
        loadingOrganizations: true,
      };
    case actionTypes.FETCH_ORGANIZATIONS_SUCCESS:
      return {
        ...state,
        organizations: action.organizations,
        loadingOrganizations: false,
      };
    case actionTypes.FETCH_ORGANIZATIONS_FAIL:
      return {
        ...state,
        error: action.error,
        loadingOrganizations: false,
      };
    default:
      return state;
  }
};

export default reducer;
