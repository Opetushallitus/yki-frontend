import * as actionTypes from './actionTypes';
import axios from '../../axios';
import { OPH_OID } from '../../common/Constants';

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
      isAdmin = identity.organizations.some(({ oid, permissions}) =>
        oid === OPH_OID &&
        permissions.some(
          ({ palvelu, oikeus }) => palvelu === "YKI" && oikeus === "YLLAPITAJA")
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
