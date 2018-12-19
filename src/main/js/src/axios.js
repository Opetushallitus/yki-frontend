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
      if (window.location.href.includes('jarjestajarekisteri')) {
        window.location.href = 'auth/cas';
      }
    }
    return error;
  },
);

export default instance;
