import axios from '../../axios';
import * as actionTypes from './actionTypes';

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

export const fetchExamDates = oid => {
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

export const updateExamDateConfigurations = (
  postAdmission,
  languages,
  oid,
  examDateId,
) => {
  return dispatch => {
    dispatch(configureExamDateLanguagesStart());
    dispatch(configureExamDatePostAdmissionStart());
    Promise.all([
      axios
        .post(
          `/yki/api/virkailija/organizer/${oid}/exam-date/${examDateId}/post-admission`,
          postAdmission,
        )
        .then(res => {
          dispatch(configureExamDateLanguagesSuccess());
        })
        .catch(err => {
          dispatch(configureExamDateLanguagesFail(err));
        }),
      axios
        .post(
          `/yki/api/virkailija/organizer/${oid}/exam-date/${examDateId}/languages`,
          languages,
        )
        .then(res => {
          dispatch(configureExamDatePostAdmissionSuccess());
        })
        .catch(err => {
          dispatch(configureExamDatePostAdmissionFail(err));
        }),
    ]).then(res => {
      dispatch(fetchExamDates());
    });
  };
};

const configureExamDateLanguagesStart = () => {
  return {
    type: actionTypes.CONFIGURE_EXAM_DATE_LANGUAGES_START,
    loading: true,
  };
};

const configureExamDateLanguagesSuccess = () => {
  return {
    type: actionTypes.CONFIGURE_EXAM_DATE_LANGUAGES_SUCCESS,
    loading: false,
  };
};

const configureExamDateLanguagesFail = error => {
  return {
    type: actionTypes.CONFIGURE_EXAM_DATE_LANGUAGES_FAIL,
    error: Object.assign(error, {
      key: 'error.examDates.languages.configurationFailed',
    }),
    loading: false,
  };
};

const configureExamDatePostAdmissionStart = () => {
  return {
    type: actionTypes.CONFIGURE_EXAM_DATE_POST_ADMISSION_START,
    loading: true,
  };
};

const configureExamDatePostAdmissionSuccess = () => {
  return {
    type: actionTypes.CONFIGURE_EXAM_DATE_POST_ADMISSION_SUCCESS,
    loading: false,
  };
};

const configureExamDatePostAdmissionFail = error => {
  return {
    type: actionTypes.CONFIGURE_EXAM_DATE_POST_ADMISSION_FAIL,
    error: Object.assign(error, {
      key: 'error.examDates.postAdmission.configurationFailed"',
    }),
    loading: false,
  };
};

export const deleteExamDate = (oid, examDateId) => {
  return dispatch => {
    dispatch(deleteExamDateStart());
    axios
      .delete(`/yki/api/virkailija/organizer/${oid}/exam-date/${examDateId}/`)
      .then(res => {
        dispatch(deleteExamDateSuccess());
        dispatch(fetchExamDates());
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

// NOT IN USE
export const updatePostAdmissionEndDate = (examDateId, endDate) => {
  return dispatch => {
    axios
      .post(`/yki/api/exam-date/${examDateId}/post-admission-end-date`, endDate)
      .then(res => {
        dispatch(fetchExamDates());
      });
    //TODO: handle error
  };
};

// NOT IN USE
export const deletePostAdmissionEndDate = examDateId => {
  return dispatch => {
    axios
      .delete(`/yki/api/exam-date/${examDateId}/post-admission-end-date`)
      .then(res => {
        dispatch(fetchExamDates());
      });
    //TODO: handle error
  };
};

// TODO: should this be in examSessions actions?
export const GetExamDatesHistory = oid => {
  return dispatch => {
    dispatch(fetchExamDatesStart());
    axios
      .get(`/yki/api/virkailija/organizer/${oid}/exam-session/history`)
      .then(res => {
        // dispatch(fetchExamSessionContent());
        dispatch(fetchExamDatesSuccess(res.data.dates));
      })
      .catch(err => {
        console.error(err);
      });
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
