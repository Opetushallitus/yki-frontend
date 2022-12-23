import axios from '../../axios';
import * as actionTypes from './actionTypes';
import * as R from 'ramda';

export const fetchQuarantineMatches = () => dispatch => {
  axios
    .get('/yki/api/virkailija/quarantine/matches')
    .then(res => dispatch(extractQuarantineMatches(res.data)))
    .catch(err => dispatch(fetchQuarantineMatchesFail(err)));
};

export const fetchQuarantines = () => dispatch => {
  axios
    .get('/yki/api/virkailija/quarantine')
    .then(res => dispatch(extractQuarantines(res.data)))
    .catch(err => dispatch(fetchQuarantineMatchesFail(err)));
};

export const deleteQuarantine = (id) => dispatch => {
  axios
    .delete(`/yki/api/virkailija/quarantine/${id}`)
    .then()
    .catch(err => dispatch(fetchQuarantineMatchesFail(err)));
};

export const setQuarantine = (id, reg_id, quarantined) => dispatch => {
  const payload = { is_quarantined: quarantined };
  axios
    .put(`/yki/api/virkailija/quarantine/${id}/registration/${reg_id}/set`, payload)
    .then(() => dispatch(fetchQuarantineMatches()))
    .catch(err => dispatch(setQuarantineFail(err)));
};

export const showAddModal = (isVisible) => dispatch => {
  return dispatch({
    type: actionTypes.SHOW_ADD_QUARANTINE,
    showAddModal: isVisible,
  });
};

export const confirmQuarantine = (callback) => dispatch => {
  return dispatch({
    type: actionTypes.CONFIRM_QUARANTINE,
    confirm: callback,
  });
};

export const addNewQuarantine = (form) => dispatch => {
  axios
    .post('/yki/api/virkailija/quarantine', form)
    .then(() => dispatch(fetchQuarantines()))
    .catch(err => dispatch(setQuarantineFail(err)));
};

export const editQuarantine = (form) => dispatch => {
  axios
    .put(`/yki/api/virkailija/quarantine/${form.id}`, form)
    .then(() => dispatch(fetchQuarantines()))
    .catch(err => dispatch(setQuarantineFail(err)));
};

const extractQuarantines = res => {
  return {
    type: actionTypes.ADD_QUARANTINES,
    quarantines: res.quarantines,
  };
};

const extractQuarantineMatches = res => {
  const matches = R.filter(
    (quarantine) => R.isNil(quarantine.reviewed),
    res.quarantines
  );
  const all = res.quarantines;

  return {
    type: actionTypes.ADD_QUARANTINE_MATCHES,
    matches: matches,
    all: all,
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
