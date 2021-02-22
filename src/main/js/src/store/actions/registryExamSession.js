import * as actionTypes from './actionTypes';
import axios from '../../axios';
import moment from 'moment';

import { ISO_DATE_FORMAT_SHORT } from '../../common/Constants';


const fetchExamSessionsStart = () => {
  return {
    type: actionTypes.FETCH_REGISTRY_EXAM_SESSIONS_START,
    loadingExamSessions: true,
  };
};

const fetchExamSessionsSuccess = examSessions => {
  return {
    type: actionTypes.FETCH_REGISTRY_EXAM_SESSIONS_SUCCESS,
    examSessions,
    loadingExamSessions: false,
  };
};

const fetchExamSessionsFail = error => {
  return {
    type: actionTypes.FETCH_REGISTRY_EXAM_SESSIONS_FAIL,
    error: Object.assign(error, { key: 'error.examSession.fetchFailed' }),
    loadingExamsessions: false,
  };
};

const fetchExamSessionParticipantsStart = () => {
  return {
    type: actionTypes.FETCH_REGISTRY_EXAM_SESSION_PARTICIPANTS_START
  };
};

const fetchExamSessionParticipantsSuccess = participants => {
  return {
    type: actionTypes.FETCH_REGISTRY_EXAM_SESSION_PARTICIPANTS_SUCCESS,
    participants
  };
};

const fetchExamSessionParticipantsFail = error => {
  return {
    type: actionTypes.FETCH_REGISTRY_EXAM_SESSION_PARTICIPANTS_FAIL,
    error: Object.assign(error, { key: 'error.examSession.fetchFailed' })
  };
};

export const fetchRegistryExamSessions = oid => {
  return dispatch => {
    dispatch(fetchExamSessionsStart());
    const today = moment().format(ISO_DATE_FORMAT_SHORT);
    axios
      .get(`/yki/api/virkailija/organizer/${oid}/exam-session?from=${today}`)
      .then(res => {
        dispatch(fetchExamSessionsSuccess(res.data.exam_sessions))
      },
      )
      .catch(err => {
        dispatch(fetchExamSessionsFail);
      });
  };
};

export const fetchRegistryExamSessionParticipants = (organizerOid, examSessionId) => {
  return dispatch => {
    dispatch(fetchExamSessionParticipantsStart());
    axios
      .get(
        `/yki/api/virkailija/organizer/${organizerOid}/exam-session/${examSessionId}/registration`,
      )
      .then(res => {
        dispatch(fetchExamSessionParticipantsSuccess(res.data.participants));
      })
      .catch(err => {
        dispatch(fetchExamSessionParticipantsFail(err));
      });
  };
};



