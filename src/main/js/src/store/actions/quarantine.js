import axios from '../../axios';
import * as actionTypes from './actionTypes';
import * as R from 'ramda';

export const fetchQuarantineMatches = () => dispatch => {
  axios
    .get('/yki/api/virkailija/quarantine/matches')
    .then(res => dispatch(extractQuarantineMatches(res.data)))
    .catch(err => dispatch(fetchQuarantineMatchesFail(err)));
};

export const setQuarantine = (id, reg_id, quarantined) => dispatch => {
  const payload = { is_quarantined: quarantined };
  axios
    .put(`/yki/api/virkailija/quarantine/${id}/registration/${reg_id}/set`, payload)
    .then(() => dispatch(fetchQuarantineMatches()))
    .catch(err => dispatch(setQuarantineFail(err)));
};

export const confirmQuarantine = (callback) => dispatch => {
  return dispatch({
    type: actionTypes.CONFIRM_QUARANTINE,
    confirm: callback,
  });
};

const extractQuarantineMatches = res => {
  const matches = R.filter(
    (quarantine) => R.isNil(quarantine.reviewed),
    res.quarantines
  );

  return {
    type: actionTypes.ADD_QUARANTINE_MATCHES,
    matches: matches,
  };
};

const fetchQuarantineMatchesFail = error => {
  return {
    type: actionTypes.FETCH_QUARANTINE_MATCHES_FAIL,
    error: error,
  };
};

const setQuarantineFail = error => {
  return {
    type: actionTypes.SET_QUARANTINE_FAIL,
    error: error,
  };
};
