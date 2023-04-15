import i18next from 'i18next';
import moment from 'moment';

import { DATE_FORMAT } from '../common/Constants';
import { levelDescription, nowBetweenDates } from './util';

const postAdmissionOpenSpots = session => {
  if (isPostAdmissionAvailable(session)) {
    return session.post_admission_quota - session.pa_participants;
  }

  return 0;
};

const admissionOpenSpots = session => {
  return session.max_participants - session.participants;
};

export const isPostAdmissionAvailable = session => {
  return (
    session.post_admission_end_date &&
    session.post_admission_start_date &&
    session.post_admission_active &&
    session.post_admission_quota
  );
};

// the purpose of session.open checks in methods below might be for handling 00.00-10.00 period during start date, and
// 16.00-23.59 during end date but not sure if it really works / does backend handle those periods properly
export const isPostAdmissionActive = session => {
  return (
    isPostAdmissionAvailable(session) &&
    nowBetweenDates(moment(session.post_admission_start_date), moment(session.post_admission_end_date)) &&
    session.open
  );
};

export const isAdmissionActive = session => {
  return (
    session.registration_end_date &&
    session.registration_start_date &&
    nowBetweenDates(moment(session.registration_start_date), moment(session.registration_end_date)) &&
    session.open
  );
};

export const isAdmissionEnded = session => {
  return (
    session.registration_end_date &&
    moment(session.registration_end_date).isBefore(moment()) &&
    !session.open
  );
};

export const isPostAdmissionEnded = session => {
  return (
    session.post_admission_end_date &&
    moment(session.post_admission_end_date).isBefore(moment()) &&
    !session.open
  );
};

export const isRegistrationPeriodEnded = session => {
  if (isPostAdmissionAvailable(session)) {
    return isPostAdmissionEnded(session);
  }

  return isAdmissionEnded(session);
};

export const hasRoom = session => {
  return getSpotsAvailableForSession(session) > 0;
};

export const hasFullQueue = session => {
  return session.queue_full;
};

export const getSpotsAvailableForSession = session => {
  return isAdmissionEnded(session)
    ? postAdmissionOpenSpots(session)
    : admissionOpenSpots(session);
};

export const examLanguageAndLevel = session => {
  const examLanguage = i18next.t(`common.language.${session.language_code}`);
  const examLevel = levelDescription(session.level_code).toLowerCase();

  return `${examLanguage}, ${examLevel}`;
};

export const formatDate = (session, key) =>
  moment(session[key]).format(DATE_FORMAT);

export const examSessionParticipantsCount = (session) => {
  const postAdmissionOpen = session.post_admission_enabled && moment()
      .isSameOrAfter(moment(session.registration_end_date));

  const participants = session.participants + (session.post_admission_quota ? session.pa_participants : 0);
  const max_participants = postAdmissionOpen ? (session.post_admission_quota + session.participants): session.max_participants;
  return {participants: participants, maxParticipants: max_participants};
}
