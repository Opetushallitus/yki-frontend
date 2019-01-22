import * as actionTypes from './actionTypes';
import axios from '../../axios';

export const fetchUser = () => {
  return dispatch => {
    dispatch(fetchUserStart());
    axios
      .get('/yki/auth/cas/user')
      .then(res => {
        dispatch(fetchUserSuccess(res.body));
      })
      .catch(err => {
        dispatch(fetchUserFail(err));
      });
  };
};

const fetchUserStart = () => {
  return {
    type: actionTypes.FETCH_REGISTRY_CONTENT_START,
    loading: true,
  };
};

const fetchUserSuccess = user => {
  return {
    type: actionTypes.FETCH_REGISTRY_CONTENT_SUCCESS,
    user: user,
    loading: false,
  };
};

const fetchUserFail = error => {
  return {
    type: actionTypes.FETCH_REGISTRY_CONTENT_FAIL,
    error: error,
    loading: false,
  };
};
