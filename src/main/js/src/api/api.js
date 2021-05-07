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
        'Caller-Id': '1.2.246.562.10.00000000001.yki',
      }),
    }).then(handleErrors);
    return promise;
  } catch (err) {
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
        'Caller-Id': '1.2.246.562.10.00000000001.yki',
      }),
    }).then(handleErrors);
    return promise;
  } catch (err) {
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
  return apiGet('LOAD_ORGANIZERS', 'yki/api/virkailija/organizer');
};

export const createOrganizer = organizer => {
  return apiPost('CREATE_ORGANIZER', 'yki/api/virkailija/organizer', organizer);
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

export const localization = () => {
  return apiGet('LOAD_LOCALIZATION', '/yki/api/localization?lang={{lng}}')
}
