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

export const fetchExamSessionContentFailReset = () => {
  return {
    type: actionTypes.FETCH_EXAM_SESSION_CONTENT_FAIL_RESET,
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
              `/yki/api/virkailija/organizer/${
                organizer.oid
              }/exam-session?from=${today}`,
            ),
          ])
            .then(([organizationRes, examSessionRes]) => {
              dispatch(
                fetchExamSessionContentSuccess({
                  organizer: organizer,
                  organization: organizationRes.data,
                  examSessions: examSessionRes.data.exam_sessions,
                }),
              );
            })
            .catch(err => {
              dispatch(fetchExamSessionContentFail(err));
            });
        } else {
          dispatch(
            fetchExamSessionContentSuccess({
              organizer: null,
              examSessions: [],
            }),
          );
        }
      })
      .catch(err => {
        dispatch(fetchExamSessionContentFail(err));
      });
  };
};
