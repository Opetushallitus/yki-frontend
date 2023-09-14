import axios from 'axios';
import i18next from 'i18next';
import { OPH_OID } from './common/Constants';
import { getCookie } from './util/util';

const instance = axios.create({
  baseURL: '',
});

instance.interceptors.request.use((config) => {
  config.headers = {
    ...config.headers,
    'Caller-Id': `${OPH_OID}.yki`,
    'CSRF': getCookie('CSRF')
  };
  // Include a lang parameter to API calls other than for fetching exam session data,
  // The additional parameter interferes with caching of exam session responses,
  // and the exam session responses contain details for multiple languages anyway.
  if (!(config.url && config.url.startsWith('/yki/api/exam-session') && config.method === 'get')) {
    const lang = i18next.language;
    config.params = { lang: lang ? lang : 'fi' };
  }
  return config;
});

instance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (
      error.response.status === 401 &&
      (window.location.href.includes('jarjestajarekisteri') ||
        window.location.href.includes('tutkintotilaisuudet') ||
        window.location.href.includes('tutkintopaivat') ||
        window.location.href.includes('maksuraportit'))
    ) {
      window.location.replace('/yki/auth/cas');
    }
    return Promise.reject(error);
  },
);

export default instance;
