import * as actionTypes from '../actions/actionTypes';

const initialState = {
  localization: 'fin',
  registry: [],
  loading: false,
  organizations: [],
  loadingOrganizations: false,
  error: null,
};

const reducer = (state = initialState, action) => {
  let registry;
  let index;
  switch (action.type) {
    case actionTypes.FETCH_REGISTRY_CONTENT_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.FETCH_REGISTRY_CONTENT_SUCCESS:
      return {
        ...state,
        registry: action.registry,
        loading: false,
      };
    case actionTypes.FETCH_REGISTRY_CONTENT_FAIL:
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
    case actionTypes.ADD_REGISTRY_ITEM_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.ADD_REGISTRY_ITEM_SUCCESS:
      return {
        ...state,
        registry: [...state.registry, action.registryItem],
        loading: false,
      };
    case actionTypes.ADD_REGISTRY_ITEM_FAIL:
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    case actionTypes.UPDATE_REGISTRY_ITEM_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.UPDATE_REGISTRY_ITEM_SUCCESS:
      registry = [...state.registry];
      index = registry
        .map(i => i.organizer.oid)
        .indexOf(action.registryItem.oid);
      registry[index].organizer = action.registryItem;
      return {
        ...state,
        registry: registry,
        loading: false,
      };
    case actionTypes.UPDATE_REGISTRY_ITEM_FAIL:
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    case actionTypes.DELETE_REGISTRY_ITEM_START:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.DELETE_REGISTRY_ITEM_SUCCESS:
      registry = [...state.registry];
      index = registry.map(i => i.organizer.oid).indexOf(action.oid);
      delete registry[index];
      return {
        ...state,
        registry: registry,
        loading: false,
      };
    case actionTypes.DELETE_REGISTRY_ITEM_FAIL:
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    default:
      return state;
  }
};

export default reducer;
