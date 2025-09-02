import moment from 'moment';

const isPostAdmissionAvailable = session => {
  return (
    session.post_admission_end_date &&
    session.post_admission_start_date &&
    session.post_admission_active &&
    session.post_admission_quota
  );
};

const isOpen = session => {
  return session.open;
};

const isAdmissionEnded = session => {
  if (!session.registration_end_date) {
    return false;
  }

  const now = moment();
  const endDate = moment(session.registration_end_date);

  // Openness check only for the endDate because the session is also open during post admission (which is after endDate)
  return (
    now.isAfter(endDate, 'day') ||
    (now.isSame(endDate, 'day') && !isOpen(session))
  );
};

export const examSessionParticipantsCount = session => {
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
