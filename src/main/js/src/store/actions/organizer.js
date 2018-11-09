import * as actionTypes from './actionTypes';
import axios from '../../axios';

export const fetchOrganizerRegistryContentStart = () => {
  return {
    type: actionTypes.FETCH_ORGANIZER_REGISTRY_CONTENT_START,
    loading: true,
  };
};

export const fetchOrganizerRegistryContentSuccess = registry => {
  return {
    type: actionTypes.FETCH_ORGANIZER_REGISTRY_CONTENT_SUCCESS,
    organizerRegistry: registry,
    loading: false,
  };
};

export const fetchOrganizerRegistryContentFail = error => {
  return {
    type: actionTypes.FETCH_ORGANIZER_REGISTRY_CONTENT_FAIL,
    loading: false,
    error: error,
  };
};

export const fetchOrganizerRegistryContent = () => {
  const fetchedOrganizers = [];
  const organizationIds = [];
  const fetchedOrganizations = [];
  const registry = [];
  return dispatch => {
    dispatch(fetchOrganizerRegistryContentStart());
    axios
      .get('/yki/api/virkailija/organizer')
      .then(res => {
        for (const key in res.data.organizers) {
          fetchedOrganizers.push(res.data.organizers[key]);
        }
        for (const key in fetchedOrganizers) {
          organizationIds.push(fetchedOrganizers[key].oid);
        }
        return axios.post(
          '/organisaatio-service/rest/organisaatio/v3/findbyoids',
          organizationIds,
        );
      })
      .then(res => {
        for (const key in res.data) {
          fetchedOrganizations.push(res.data[key]);
        }
        for (const key in fetchedOrganizers) {
          const organization = fetchedOrganizations.find(
            organization => organization.oid === fetchedOrganizers[key].oid,
          );
          registry.push({
            organizer: fetchedOrganizers[key],
            organization: organization,
          });
        }
        dispatch(fetchOrganizerRegistryContentSuccess(registry));
        dispatch(fetchOrganizations());
      })
      .catch(err => {
        dispatch(fetchOrganizerRegistryContentFail(err));
      });
  };
};

export const fetchOrganizationsStart = () => {
  return {
    type: actionTypes.FETCH_ORGANIZATIONS_START,
    loadingOrganizations: true,
  };
};

export const fetchOrganizationsSuccess = organizations => {
  return {
    type: actionTypes.FETCH_ORGANIZATIONS_SUCCESS,
    organizations: organizations,
    loadingOrganizations: false,
  };
};

export const fetchOrganizationsFail = error => {
  return {
    type: actionTypes.FETCH_ORGANIZATIONS_FAIL,
    loadingOrganizations: false,
    error: error,
  };
};

export const fetchOrganizations = () => {
  return dispatch => {
    dispatch(fetchOrganizationsStart());
    axios
      .get(
        '/organisaatio-service/rest/organisaatio/v4/hae?searchStr=&aktiiviset=true&suunnitellut=true&lakkautetut=false',
      )
      .then(res => {
        dispatch(fetchOrganizationsSuccess(res.data.organisaatiot));
      })
      .catch(err => {
        dispatch(fetchOrganizationsFail(err));
      });
  };
};
