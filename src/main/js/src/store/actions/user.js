import * as actionTypes from './actionTypes';
import axios from '../../axios';

export const fetchUser = () => {
  return dispatch => {
    dispatch(fetchUserStart());
    axios
      .get('/yki/auth/user')
      .then(res => {
        dispatch(fetchUserSuccess(res.data.identity));
      })
      .catch(err => {
        dispatch(fetchUserFail(err));
      });
  };
};

const fetchUserStart = () => {
  return {
    type: actionTypes.FETCH_USER_START,
    loading: true,
  };
};

const fetchUserSuccess = identity => {
  if (identity) {
    let isAdmin = false;
    if (identity.organizations) {
      const organization = identity.organizations[0];
      isAdmin = organization.permissions.some(
        p => p.palvelu === 'YKI' && p.oikeus === 'YLLAPITAJA',
      );
    }
    return {
      type: actionTypes.FETCH_USER_SUCCESS,
      user: { identity: identity, isAdmin: isAdmin },
      loading: false,
    };
  } else {
    return {
      type: actionTypes.FETCH_USER_SUCCESS,
      user: null,
      loading: false,
    };
  }
};

const fetchUserFail = error => {
  return {
    type: actionTypes.FETCH_USER_FAIL,
    error: error,
    loading: false,
  };
};
