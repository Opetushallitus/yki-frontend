import moment from 'moment';

import axios from '../../axios';
import { ISO_DATE_FORMAT_SHORT } from '../../common/Constants';
import * as actionTypes from './actionTypes';

const fetchExamDatesStart = () => {
  return {
    type: actionTypes.FETCH_EXAM_DATES_START
  };
};

const fetchExamDatesSuccess = examDates => {
  return {
    type: actionTypes.FETCH_EXAM_DATES_SUCCESS,
    examDates: examDates
  };
};

const fetchExamDatesFail = error => {
  return {
    type: actionTypes.FETCH_EXAM_DATES_FAIL,
    error: Object.assign(error, { key: 'error.examDates.fetchFailed' })
  };
};

export const examDatesFailReset = () => {
  return {
    type: actionTypes.EXAM_DATES_FAIL_RESET,
  };
};

export const fetchExamDates = (oid, fetchHistory) => {
  return dispatch => {
    dispatch(fetchExamDatesStart());
    const today = moment().format(ISO_DATE_FORMAT_SHORT);
    const baseUrl = `/yki/api/virkailija/organizer/${oid}/exam-date`;
    const url = fetchHistory ? `${baseUrl}?from=${today}&days=180` : baseUrl;
    axios
      .get(url)
      .then(res => {
        dispatch(fetchExamDatesSuccess(res.data.dates));
      })
      .catch(err => {
        dispatch(fetchExamDatesFail(err));
      });
  };
};

export const addExamDate = (payload, oid) => {
  return dispatch => {
    dispatch(addExamDateStart());
    axios
      .post(`/yki/api/virkailija/organizer/${oid}/exam-date`, payload)
      .then(() => {
        dispatch(addExamDateSuccess());
        dispatch(fetchExamDates(oid));
      })
      .catch(err => {
        dispatch(addExamDateFail(err));
      });
  };
};

const addExamDateStart = () => {
  return {
    type: actionTypes.ADD_EXAM_DATE_START,
    loading: true,
  };
};

const addExamDateSuccess = () => {
  return {
    type: actionTypes.ADD_EXAM_DATE_SUCCESS,
    loading: false,
  };
};

const addExamDateFail = error => {
  return {
    type: actionTypes.ADD_EXAM_DATE_FAIL,
    error: Object.assign(error, { key: 'error.examDates.addFailed' }),
    loading: false,
  };
};

export const updateExamDate = (examDateId, payload, oid) => {
  return dispatch => {
    dispatch(updateExamDateStart());

    axios
      .put(
        `/yki/api/virkailija/organizer/${oid}/exam-date/${examDateId}`,
        payload,
      )
      .then(() => {
        dispatch(updateExamDateSuccess());
        dispatch(fetchExamDates(oid));
      })
      .catch(err => {
        dispatch(updateExamDateFail(err));
      });
  };
};

const updateExamDateStart = () => {
  return {
    type: actionTypes.UPDATE_EXAM_DATE_START,
    loading: true,
  };
};

const updateExamDateSuccess = () => {
  return {
    type: actionTypes.UPDATE_EXAM_DATE_SUCCESS,
    loading: false,
  };
};

const updateExamDateFail = error => {
  return {
    type: actionTypes.UPDATE_EXAM_DATE_FAIL,
    error: Object.assign(error, {
      key: 'error.examDates.updateFailed',
    }),
    loading: false,
  };
};

export const deleteExamDate = (examDateId, oid) => {
  return dispatch => {
    dispatch(deleteExamDateStart());
    axios
      .delete(`/yki/api/virkailija/organizer/${oid}/exam-date/${examDateId}`)
      .then(res => {
        dispatch(deleteExamDateSuccess());
        dispatch(fetchExamDates(oid));
      })
      .catch(err => {
        dispatch(deleteExamDateFail(err));
      });
    //TODO: handle error
  };
};

const deleteExamDateStart = () => {
  return {
    type: actionTypes.DELETE_EXAM_DATE_START,
    loading: true,
  };
};

const deleteExamDateSuccess = () => {
  return {
    type: actionTypes.DELETE_EXAM_DATE_SUCCESS,
    loading: false,
  };
};

const deleteExamDateFail = error => {
  return {
    type: actionTypes.DELETE_EXAM_DATE_FAIL,
    error: Object.assign(error, { key: 'error.examDates.deleteFailed' }),
    loading: false,
  };
};

export const addEvaluationPeriod = ({
  id,
  oid,
  evaluation_start_date,
  evaluation_end_date,
}) => {
  return dispatch => {
    dispatch(addEvaluationPeriodStart());
    axios
      .post(`/yki/api/virkailija/organizer/${oid}/exam-date/${id}/evaluation`, {
        evaluation_start_date,
        evaluation_end_date,
      })
      .then(() => {
        dispatch(addEvaluationPeriodSuccess());
        dispatch(fetchExamDates(oid));
      })
      .catch(err => {
        dispatch(addEvaluationPeriodFail(err));
      });
  };
};

const addEvaluationPeriodStart = () => {
  return {
    type: actionTypes.ADD_EVALUATION_PERIOD_START,
  };
};

const addEvaluationPeriodSuccess = () => {
  return {
    type: actionTypes.ADD_EVALUATION_PERIOD_SUCCESS,
  };
};

const addEvaluationPeriodFail = error => {
  return {
    type: actionTypes.ADD_EVALUATION_PERIOD_FAIL,
    error: Object.assign(error, { key: 'error.examDates.addFailed' }),
  };
};
