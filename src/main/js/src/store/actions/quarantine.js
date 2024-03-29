import axios from '../../axios';
import * as actionTypes from './actionTypes';

export const fetchQuarantineMatches = () => dispatch => {
  dispatch({
    type: actionTypes.LOADING_QUARANTINE,
    loading: true,
  });

  axios
    .get('/yki/api/virkailija/quarantine/matches')
    .then(res => dispatch(extractQuarantineMatches(res.data)))
    .then(() => dispatch({
      type: actionTypes.LOADING_QUARANTINE,
      loading: false,
    }))
    .catch(err => dispatch(fetchQuarantineMatchesFail(err)));
};

export const fetchQuarantineReviews = () => dispatch => {
  dispatch({
    type: actionTypes.LOADING_QUARANTINE,
    loading: true,
  });

  axios
    .get('/yki/api/virkailija/quarantine/reviews')
    .then(res => dispatch(extractQuarantineReviews(res.data)))
    .then(() => dispatch({
      type: actionTypes.LOADING_QUARANTINE,
      loading: false,
    }))
    .catch(err => dispatch(fetchQuarantineMatchesFail(err)));
};

export const fetchQuarantines = () => dispatch => {
  dispatch({
    type: actionTypes.LOADING_QUARANTINE,
    loading: true,
  });

  axios
    .get('/yki/api/virkailija/quarantine')
    .then(res => dispatch(extractQuarantines(res.data)))
    .then(() => dispatch({
      type: actionTypes.LOADING_QUARANTINE,
      loading: false,
    }))
    .catch(err => dispatch(fetchQuarantineMatchesFail(err)));
};

export const deleteQuarantine = (id) => dispatch => {
  dispatch({
    type: actionTypes.LOADING_QUARANTINE,
    loading: true,
  });

  axios
    .delete(`/yki/api/virkailija/quarantine/${id}`)
    .then(() => dispatch(fetchQuarantines()))
    .then(() => dispatch(closeConfirmQuarantine()))
    .then(() => dispatch({
      type: actionTypes.LOADING_QUARANTINE,
      loading: false,
    }))
    .catch(err => dispatch(fetchQuarantineMatchesFail(err)));
};

export const setQuarantine = (id, reg_id, quarantined) => dispatch => {
  dispatch({
    type: actionTypes.LOADING_QUARANTINE,
    loading: true,
  });

  const payload = { is_quarantined: quarantined };
  axios
    .put(`/yki/api/virkailija/quarantine/${id}/registration/${reg_id}/set`, payload)
    .then(() => dispatch(fetchQuarantineMatches()))
    .then(() => dispatch(fetchQuarantineReviews()))
    .then(() => dispatch(closeConfirmQuarantine()))
    .then(() => dispatch({
      type: actionTypes.LOADING_QUARANTINE,
      loading: false,
    }))
    .catch(err => dispatch(setQuarantineFail(err)));
};

export const addNewQuarantine = (form) => dispatch => {
  dispatch({
    type: actionTypes.LOADING_QUARANTINE,
    loading: true,
  });

  axios
    .post('/yki/api/virkailija/quarantine', form)
    .then(() => dispatch(fetchQuarantines()))
    .then(() => dispatch(showAddModal(null)))
    .then(() => dispatch({
      type: actionTypes.LOADING_QUARANTINE,
      loading: false,
    }))
    .catch(err => dispatch(setQuarantineFail(err)));
};

export const editQuarantine = (form) => dispatch => {
  dispatch({
    type: actionTypes.LOADING_QUARANTINE,
    loading: true,
  });

  axios
    .put(`/yki/api/virkailija/quarantine/${form.id}`, form)
    .then(() => dispatch(fetchQuarantines()))
    .then(() => dispatch(showAddModal(null)))
    .then(() => dispatch({
      type: actionTypes.LOADING_QUARANTINE,
      loading: false,
    }))
    .catch(err => dispatch(setQuarantineFail(err)));
};

export const resetAll = () => dispatch => {
  return dispatch({
    type: actionTypes.RESET_QUARANTINE
  });
};

export const showAddModal = (isVisible) => dispatch => {
  return dispatch({
    type: actionTypes.SHOW_ADD_QUARANTINE,
    showAddModal: isVisible,
  });
};

export const closeConfirmQuarantine = () => dispatch => {
  return dispatch({
    type: actionTypes.CONFIRM_QUARANTINE,
    confirm: null,
  });
};

export const confirmQuarantine = (callback, registrationId, quarantineId, quarantined) => dispatch => {
  return dispatch({
    type: actionTypes.CONFIRM_QUARANTINE,
    confirm: {
      callback,
      registrationId,
      quarantineId,
      quarantined
    },
  });
};

const extractQuarantines = res => {
  return {
    type: actionTypes.ADD_QUARANTINES,
    quarantines: res.quarantines,
  };
};

const extractQuarantineMatches = res => {
  const matches = res.quarantine_matches || [];

  return {
    type: actionTypes.ADD_QUARANTINE_MATCHES,
    matches: matches,
  };
};

const extractQuarantineReviews = res => {
  const reviews = res.reviews || [];

  return {
    type: actionTypes.ADD_QUARANTINE_REVIEWS,
    reviews,
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
