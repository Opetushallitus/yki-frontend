import axios from 'axios';

const instance = axios.create({
  baseURL: '',
});

instance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response.status === 401) {
      if (
        window.location.href.includes('jarjestajarekisteri') ||
        window.location.href.includes('tutkintotilaisuudet')
      ) {
        window.location.href = `auth/cas?success-redirect=${window.location.href}`;
      }
    }
    return Promise.reject(error);
  },
);

export default instance;
