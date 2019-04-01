import store from '../store';

const config = {
  baseUrl: '',
  locale: '',
};

function handleErrors(response) {
  if (response.ok) return response.json();
  throw new Error(response.statusText, response);
}

const apiGet = async (name, url, params = {}) => {
  try {
    const promise = fetch(`${config.baseUrl}/${url}`, {
      method: 'GET',
      headers: new Headers({
        Accept: 'application/json',
      }),
    }).then(handleErrors);
    store.dispatch({ type: `${name}_PENDING`, params });
    store.dispatch({
      type: `${name}_SUCCESS`,
      params,
      response: await promise,
    });
    return promise;
  } catch (err) {
    store.dispatch({ type: `${name}_ERROR`, params, error: err.message });
    console.error(`${name} failed: ${err.message}`);
  }
};

const apiPost = async (name, url, body, params = {}) => {
  try {
    const promise = fetch(`${config.baseUrl}/${url}`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    }).then(handleErrors);
    store.dispatch({ type: `${name}_PENDING`, params });
    store.dispatch({
      type: `${name}_SUCCESS`,
      params,
      response: await promise,
    });
    return promise;
  } catch (err) {
    store.dispatch({ type: `${name}_ERROR`, params, error: err.message });
    console.error(`${name} failed: ${err.message}`);
  }
};

export const loadOrganizationsByOids = oids => {
  return apiPost(
    'LOAD_ORGANIZATIONS_BY_OIDS',
    'organisaatio-service/rest/organisaatio/v3/findbyoids',
    oids,
  );
};

export const loadOrganizers = () => {
  return apiGet('LOAD_ORGANIZERS', 'yki/api/virkailija/organizers');
};

export const createOrganizer = organizer => {
  return apiPost(
    'CREATE_ORGANIZER',
    'yki/api/virkailija/organizers',
    organizer,
  );
};

export const loadOrganization = oid => {
  return apiGet(
    'LOAD_ORGANIZATION',
    `organisaatio-service/rest/organisaatio/v3/${oid}`,
    oid,
  );
};

export const loadOrganizationsByFreeText = searchText => {
  return apiGet(
    'LOAD_ORGANIZATIONS_BY_FREE_TEXT',
    `organisaatio-service/rest/organisaatio/v2/hae/tyyppi?searchStr=${searchText}&aktiiviset=true&suunnitellut=true&lakkautetut=false`,
  );
};
