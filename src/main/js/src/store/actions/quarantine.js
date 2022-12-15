import axios from '../../axios';
import * as actionTypes from './actionTypes';

export const fetchQuarantineMatches = () => dispatch => {
  axios
    .get('/yki/api/virkailija/quarantine/matches')
    .then(res => dispatch(extractQuarantineMatches(res.data)))
    .catch();
};

export const setQuarantine = (id, reg_id) => dispatch => {
  const payload = { is_quarantined: true };

  axios
    .put(`/yki/api/virkailija/quarantine/${id}/registration/${reg_id}/set`, payload)
    .then()
    .catch();
};

const extractQuarantineMatches = matches => {
  return {
    type: actionTypes.ADD_QUARANTINE_MATCHES,
    matches: matches.quarantines,
  };
};
