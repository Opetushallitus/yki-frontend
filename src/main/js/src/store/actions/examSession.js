import * as actionTypes from './actionTypes';
import axios from '../../axios';
import moment from 'moment';

import { ISO_DATE_FORMAT_SHORT } from '../../common/Constants';

const fetchExamSessionContentStart = () => {
  return {
    type: actionTypes.FETCH_EXAM_SESSION_CONTENT_START,
    loading: true,
  };
};

const fetchExamSessionContentSuccess = examSessionContent => {
  return {
    type: actionTypes.FETCH_EXAM_SESSION_CONTENT_SUCCESS,
    examSessionContent: examSessionContent,
    loading: false,
  };
};

const fetchExamSessionContentFail = error => {
  return {
    type: actionTypes.FETCH_EXAM_SESSION_CONTENT_FAIL,
    error: Object.assign(error, { key: 'error.examSession.fetchFailed' }),
    loading: false,
  };
};

export const fetchExamSessionContent = () => {
  return dispatch => {
    dispatch(fetchExamSessionContentStart());
    const today = moment().format(ISO_DATE_FORMAT_SHORT);
    axios
      .get(`/yki/api/virkailija/organizer`)
      .then(orgRes => {
        // there should always be at most one organizer
        const organizer = orgRes.data.organizers[0];
        if (organizer) {
          Promise.all([
            axios.get(
              `/organisaatio-service/rest/organisaatio/v4/${organizer.oid}`,
            ),
            axios.get(
              `/organisaatio-service/rest/organisaatio/v4/${
                organizer.oid
              }/children`,
            ),
            axios.get(
              `/yki/api/virkailija/organizer/${
                organizer.oid
              }/exam-session?from=${today}`,
            ),
            axios.get('/yki/api/exam-date'),
          ])
            .then(
              ([
                organizationRes,
                organizationChildrenRes,
                examSessionRes,
                examDateRes,
              ]) => {
                dispatch(
                  fetchExamSessionContentSuccess({
                    organizer: organizer,
                    organization: organizationRes.data,
                    organizationChildren: organizationChildrenRes.data,
                    examSessions: examSessionRes.data.exam_sessions,
                    examDates: examDateRes.data.dates,
                  }),
                );
              },
            )
            .catch(err => {
              dispatch(fetchExamSessionContentFail(err));
            });
        } else {
          dispatch(
            fetchExamSessionContentSuccess({
              organizer: null,
              organizationChildren: [],
              examSessions: [],
              examDates: [],
            }),
          );
        }
      })
      .catch(err => {
        dispatch(fetchExamSessionContentFail(err));
      });
  };
};

export const addExamSession = (examSession, oid) => {
  return dispatch => {
    dispatch(addExamSessionStart());
    axios
      .post(`/yki/api/virkailija/organizer/${oid}/exam-session`, examSession)
      .then(() => {
        dispatch(addExamSessionSuccess());
      })
      .catch(err => {
        dispatch(addExamSessionFail(err));
      });
  };
};

const addExamSessionStart = () => {
  return {
    type: actionTypes.ADD_EXAM_SESSION_START,
    loading: true,
  };
};

const addExamSessionSuccess = () => {
  return {
    type: actionTypes.ADD_EXAM_SESSION_SUCCESS,
    loading: false,
  };
};

const addExamSessionFail = error => {
  return {
    type: actionTypes.ADD_EXAM_SESSION_FAIL,
    error: Object.assign(error, { key: 'error.examSession.addFailed' }),
    loading: false,
  };
};

export const updateExamSession = (examSession, oid) => {
  return dispatch => {
    dispatch(updateExamSessionStart());
    axios
      .put(
        `/yki/api/virkailija/organizer/${oid}/exam-session/${examSession.id}`,
        examSession,
      )
      .then(() => {
        dispatch(updateExamSessionSuccess());
      })
      .catch(err => {
        dispatch(updateExamSessionFail(err));
      });
  };
};

const updateExamSessionStart = () => {
  return {
    type: actionTypes.UPDATE_EXAM_SESSION_START,
    loading: true,
  };
};

const updateExamSessionSuccess = () => {
  return {
    type: actionTypes.UPDATE_EXAM_SESSION_SUCCESS,
    loading: false,
  };
};

const updateExamSessionFail = error => {
  return {
    type: actionTypes.UPDATE_EXAM_SESSION_FAIL,
    error: Object.assign(error, { key: 'error.examSession.updateFailed' }),
    loading: false,
  };
};

const fetchExamSessionParticipantsStart = () => {
  return {
    type: actionTypes.FETCH_EXAM_SESSION_PARTICIPANTS_START,
    loading: true,
  };
};

const fetchExamSessionParticipantsSuccess = participants => {
  return {
    type: actionTypes.FETCH_EXAM_SESSION_PARTICIPANTS_SUCCESS,
    participants: participants,
    loading: false,
  };
};

const fetchExamSessionParticipantsFail = error => {
  return {
    type: actionTypes.FETCH_EXAM_SESSION_PARTICIPANTS_FAIL,
    error: Object.assign(error, {
      key: 'error.examSession.fetchParticipantsFailed',
    }),
    loading: false,
  };
};

export const examSessionFailReset = () => {
  return {
    type: actionTypes.EXAM_SESSION_FAIL_RESET,
  };
};

export const fetchExamSessionParticipants = (organizerOid, examSessionId) => {
  return dispatch => {
    dispatch(fetchExamSessionParticipantsStart());
    axios
      .get(
        `/yki/api/virkailija/organizer/${organizerOid}/exam-session/${examSessionId}/participant`,
      )
      .then(res => {
        dispatch(fetchExamSessionParticipantsSuccess(res.data.participants));
      })
      .catch(err => {
        dispatch(fetchExamSessionParticipantsFail(err));
      });
  };
};

export const deleteExamSession = (oid, examSessionId) => {
  return dispatch => {
    dispatch(deleteExamSessionStart());
    axios
      .delete(
        `/yki/api/virkailija/organizer/${oid}/exam-session/${examSessionId}`,
      )
      .then(() => {
        dispatch(deleteExamSessionSuccess());
      })
      .catch(err => {
        dispatch(deleteExamSessionFail(err));
      });
  };
};

const deleteExamSessionStart = () => {
  return {
    type: actionTypes.DELETE_EXAM_SESSION_START,
    loading: true,
  };
};

const deleteExamSessionSuccess = () => {
  return {
    type: actionTypes.DELETE_EXAM_SESSION_SUCCESS,
    loading: false,
  };
};

const deleteExamSessionFail = error => {
  return {
    type: actionTypes.DELETE_EXAM_SESSION_FAIL,
    error: Object.assign(error, { key: 'error.examSession.deleteFailed' }),
    loading: false,
  };
};
