import i18next from 'i18next';
import moment from 'moment';

import { DATE_FORMAT } from '../common/Constants';
import { levelDescription } from './util';

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

export const isAdmissionEnded = session => {
  if (!session.registration_end_date) {
    return false;
  }

  const now = moment();
  const endDate = moment(session.registration_end_date);

  // Openness check only for the endDate because the session is also open during post admission (which is after endDate)
  return now.isAfter(endDate, 'day') || (now.isSame(endDate, 'day') && !isOpen(session));
};

export const isPostAdmissionEnded = session => {
  if (!session.post_admission_end_date) {
    return false;
  }

  const now = moment();
  const endDate = moment(session.post_admission_end_date);

  return now.isAfter(endDate, 'day') || (now.isSame(endDate, 'day') && !isOpen(session));
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

export const isOpen = session => {
  return session.open;
}

export const getSpotsAvailableForSession = session => {
  return !isAdmissionEnded(session)
    ? admissionOpenSpots(session)
    : postAdmissionOpenSpots(session);
};

export const isPostAdmissionActive = session => {
  return isAdmissionEnded(session) && isPostAdmissionAvailable(session);
};

export const examLanguageAndLevel = session => {
  const examLanguage = i18next.t(`common.language.${session.language_code}`);
  const examLevel = levelDescription(session.level_code).toLowerCase();

  return `${examLanguage}, ${examLevel}`;
};

export const formatDate = (session, key) =>
  moment(session[key]).format(DATE_FORMAT);

export const examSessionParticipantsCount = (session) => {
  if (isAdmissionEnded(session) && isPostAdmissionAvailable(session)) {
    return {
      participants: session.participants + session.pa_participants,
      maxParticipants: session.participants + session.post_admission_quota,
    };
  }

  return {
    participants: session.participants,
    maxParticipants: session.max_participants,
  };
};
