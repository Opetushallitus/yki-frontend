import axios from 'axios';
import i18next from 'i18next';
import { getCookie } from './util/util';

const instance = axios.create({
  baseURL: '',
});

instance.interceptors.request.use((config) => {
  const lang = i18next.language;
  config.headers = {
    ...config.headers,
    'Caller-Id': '1.2.246.562.10.00000000001.yki',
    'CSRF': getCookie('CSRF')
  };
  config.params = { lang: lang ? lang : 'fi' };
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
        window.location.href.includes('tutkintopaivat')) ||
        window.location.href.includes('maksuraportit')
    ) {
      window.location.replace('/yki/auth/cas');
    }
    return Promise.reject(error);
  },
);

export default instance;
