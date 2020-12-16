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

export const fetchExamDates = (oid) => {
  return dispatch => {
    dispatch(fetchExamDatesStart());
    axios
      .get(`/yki/api/virkailija/organizer/${oid}/exam-date`)
      .then(res => {
        dispatch(fetchExamDatesSuccess(res.data.dates));
      })
      .catch(err => {
        dispatch(fetchExamDatesFail(err));
      });
  };
};

export const addExamDate = (examDate, oid) => {
  return dispatch => {
    dispatch(addExamDateStart());
    axios
      .post(`/yki/api/virkailija/organizer/${oid}/exam-date`, examDate)
      .then(() => {
        dispatch(addExamDateSuccess());
        dispatch(fetchExamDates(oid))
      })
      .catch(err => {
        dispatch(addExamDateFail(err));
      });
  };
}

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
    error: Object.assign(error, { key: 'error.examDate.addFailed' }),
    loading: false,
  };
};

export const updateExamDateConfigurations = (postAdmission, languages, oid, examDateId) => {
  return dispatch => {
    Promise.all([
      axios
        .post(`/yki/api/virkailija/organizer/${oid}/exam-date/${examDateId}/post-admission`, postAdmission)
        .then(res => {
          dispatch(fetchExamDates());
        }),
      axios
        .post(`/yki/api/virkailija/organizer/${oid}/exam-date/${examDateId}/languages`, languages)
        .then(res => {
          dispatch(fetchExamDates());
        }),
    ])
  }
}

export const deleteExamDate = (oid, examDateId) => {
  return dispatch => {
    axios
      .delete(`/yki/api/virkailija/organizer/${oid}/exam-date/${examDateId}/`)
      .then(res => {
        dispatch(fetchExamDates());
      })
    //TODO: handle error
  }
}

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