import axios from 'axios';
import i18next from 'i18next';

const instance = axios.create({
  baseURL: '',
});

instance.interceptors.request.use((config) => {
  const lang = i18next.language;
  config.params = {lang: lang ? lang : 'fi'};
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
        window.location.href.includes('tutkintopaivat'))
    ) {
      window.location.replace('/yki/auth/cas');
    }
    return Promise.reject(error);
  },
);

export default instance;
