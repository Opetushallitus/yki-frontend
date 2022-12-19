import axios from '../../axios';
import * as actionTypes from './actionTypes';
import * as R from 'ramda';

export const fetchQuarantineMatches = () => dispatch => {
  axios
    .get('/yki/api/virkailija/quarantine/matches')
    .then(res => dispatch(extractQuarantineMatches(res.data)))
    .catch();
};

export const setQuarantine = (id, reg_id, quarantined) => dispatch => {
  const payload = { is_quarantined: quarantined };
  axios
    .put(`/yki/api/virkailija/quarantine/${id}/registration/${reg_id}/set`, payload)
    .then(() => {
      dispatch(fetchQuarantineMatches());
    })
    .catch();
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
