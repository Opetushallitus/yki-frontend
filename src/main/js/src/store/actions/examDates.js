import * as actionTypes from './actionTypes';
import axios from '../../axios';

const fetchExamDatesStart = () => {
  return {
    type: actionTypes.FETCH_EXAM_DATES_START,
    loading: true,
  };
};

const fetchExamDatesSuccess = examDates => {
  return {
    type: actionTypes.FETCH_EXAM_DATES_SUCCESS,
    examDates: examDates,
    loading: false,
  };
};

const fetchExamDatesFail = error => {
  return {
    type: actionTypes.FETCH_EXAM_DATES_FAIL,
    error: Object.assign(error, { key: 'error.examDates.fetchFailed' }),
    loading: false,
  };
};

export const examDatesFailReset = () => {
  return {
    type: actionTypes.EXAM_DATES_FAIL_RESET,
  };
};

export const fetchExamDates = () => {
  return dispatch => {
    dispatch(fetchExamDatesStart());
    axios
      .get('/yki/api/exam-date')
      .then(res => {
        dispatch(fetchExamDatesSuccess(res.data.dates));
      })
      .catch(err => {
        dispatch(fetchExamDatesFail(err));
      });
  };
};

export const updatePostAdmissionEndDate = (examDateId, endDate) => {
  return dispatch => {
    axios
      .post(`/yki/api/exam-date/${examDateId}/post-admission-end-date`, endDate)
      .then(res => {
        dispatch(fetchExamDates());
      });
      //TODO: handle error
  }
}

export const deletePostAdmissionEndDate = examDateId => {
  return dispatch => {
    axios
      .delete(`/yki/api/exam-date/${examDateId}/post-admission-end-date`)
      .then(res => {
        dispatch(fetchExamDates());
      })
      //TODO: handle error
  }
}

// TODO: should this be in examSessions actions?
export const GetExamDatesHistory = (oid) => {
  return dispatch => {
    dispatch(fetchExamDatesStart());
    axios
      .get(`/yki/api/virkailija/organizer/${oid}/exam-session/history`)
      .then(res => {
        // dispatch(fetchExamSessionContent());
        dispatch(fetchExamDatesSuccess(res.data.dates));
      })
      .catch(err => {
        console.error(err)
      });
  }
}