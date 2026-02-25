import * as actionTypes from './actionTypes';
import axios from '../../axios';
import moment from 'moment';

import {
  ISO_DATE_FORMAT_SHORT,
  ORG_TYPE_MUU_ORGANISAATIO,
  ORG_TYPE_OPPILAITOS,
  ORG_TYPE_TOIMIPISTE,
} from '../../common/Constants';
import { fetchRegistryExamSessionParticipants } from './registryExamSession';

const flattenOrganizationHierarchy = orgChildrenResponse => {
  const mapConcatOrgs = orgs => {
    return orgs.map(o =>
      [{ nimi: o.nimi, oid: o.oid, tyypit: o.tyypit }].concat(
        mapConcatOrgs(o.children),
      ),
    );
  };

  return mapConcatOrgs(orgChildrenResponse)
    .flat(20)
    .filter(
      ({ tyypit }) =>
        tyypit.includes(ORG_TYPE_OPPILAITOS) ||
        tyypit.includes(ORG_TYPE_TOIMIPISTE) ||
        tyypit.includes(ORG_TYPE_MUU_ORGANISAATIO),
    );
};

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

export const fetchExamSessionContent = organizerOid => {
  return dispatch => {
    dispatch(fetchExamSessionContentStart());
    const oneYearAgo = moment()
      .subtract(365, 'days')
      .format(ISO_DATE_FORMAT_SHORT);

    axios
      .get(`/yki/api/virkailija/organizer`)
      .then(orgRes => {
        // For the purposes of this view, we need to get regarding a single organizer
        // However, for certain users (admin, extensive read access) the above endpoint will return
        // data for multiple organizers. Especially in the case that a user is both an organizer AND has extensive read access,
        // this means that we should find the single organizer entry that matches the organization for which they have the organizer permission.
        const organizers = orgRes.data.organizers;
        let organizer;
        if (organizers && organizers.length > 1 && !!organizerOid) {
          organizer = organizers.find(({ oid }) => oid === organizerOid);
        }
        // Fallback to previous behaviour in case we failed to find any suitable organizer above
        if (!organizer) {
          organizer = orgRes.data.organizers[0];
        }
        if (organizer) {
          Promise.all([
            axios.get(
              `/organisaatio-service/rest/organisaatio/v4/${organizer.oid}`,
            ),
            axios.get(
              `/organisaatio-service/rest/organisaatio/v4/hierarkia/hae?aktiiviset=true&suunnitellut=true&lakkautetut=false&oid=${organizer.oid}`,
            ),
            axios.get(
              `/yki/api/virkailija/organizer/${organizer.oid}/exam-session?from=${oneYearAgo}`,
            ),
            axios.get(
              `/yki/api/virkailija/organizer/${organizer.oid}/exam-date`,
            ),
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
                    organizationChildren: flattenOrganizationHierarchy(
                      organizationChildrenRes.data.organisaatiot,
                    ),
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
        setTimeout(() => {
          dispatch(fetchExamSessionContentFail(err));
        }, 500);
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
        dispatch(fetchExamSessionContent(oid));
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
        dispatch(fetchExamSessionContent(oid));
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

export const deleteExamSession = (oid, examSessionId) => {
  return dispatch => {
    dispatch(deleteExamSessionStart());
    axios
      .delete(
        `/yki/api/virkailija/organizer/${oid}/exam-session/${examSessionId}`,
      )
      .then(() => {
        dispatch(deleteExamSessionSuccess());
        dispatch(fetchExamSessionContent(oid));
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

export const cancelRegistration = (
  oid,
  examSessionId,
  registrationId,
  isAdminView,
) => {
  return dispatch => {
    dispatch(cancelRegistrationStart());
    axios
      .delete(
        `/yki/api/virkailija/organizer/${oid}/exam-session/${examSessionId}/registration/${registrationId}`,
      )
      .then(() => {
        dispatch(cancelRegistrationSuccess());
        isAdminView
          ? dispatch(fetchRegistryExamSessionParticipants(oid, examSessionId))
          : dispatch(fetchExamSessionParticipants(oid, examSessionId));
      })
      .catch(err => {
        dispatch(cancelRegistrationFail(err));
      });
  };
};

const cancelRegistrationStart = () => {
  return {
    type: actionTypes.EXAM_SESSION_CANCEL_REGISTRATION_START,
    loading: true,
  };
};

const cancelRegistrationSuccess = () => {
  return {
    type: actionTypes.EXAM_SESSION_CANCEL_REGISTRATION_SUCCESS,
    loading: false,
  };
};

const cancelRegistrationFail = error => {
  return {
    type: actionTypes.EXAM_SESSION_CANCEL_REGISTRATION_FAIL,
    error: Object.assign(error, { key: 'error.registration.cancelFailed' }),
    loading: false,
  };
};

export const relocateExamSession = (
  oid,
  examSessionId,
  registrationId,
  toExamSessionId,
  isAdminView,
) => {
  return dispatch => {
    dispatch(relocateExamSessionStart());
    axios
      .post(
        `/yki/api/virkailija/organizer/${oid}/exam-session/${examSessionId}/registration/${registrationId}/relocate`,
        { to_exam_session_id: toExamSessionId },
      )
      .then(() => {
        dispatch(relocateExamSessionSuccess());
        isAdminView
          ? dispatch(fetchRegistryExamSessionParticipants(oid, examSessionId))
          : dispatch(fetchExamSessionParticipants(oid, examSessionId));
      })
      .catch(err => {
        dispatch(relocateExamSessionFail(err));
      });
  };
};

const relocateExamSessionStart = () => {
  return {
    type: actionTypes.EXAM_SESSION_RELOCATE_START,
    loading: true,
  };
};

const relocateExamSessionSuccess = () => {
  return {
    type: actionTypes.EXAM_SESSION_RELOCATE_SUCCESS,
    loading: false,
  };
};

const relocateExamSessionFail = error => {
  const errorMsg =
    error && error.response && error.response.data && error.response.data.error;
  const registered = errorMsg === 'registered';

  return {
    type: actionTypes.EXAM_SESSION_RELOCATE_FAIL,
    error: {
      key: 'error.examSession.registration.relocateExamSessionFailed',
      errorDetails:
        registered &&
        'error.examSession.registration.relocateExamSessionFailed.alreadyRegistered',
    },
    loading: false,
  };
};
