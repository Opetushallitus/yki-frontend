import moment from 'moment';
import { nowBetweenDates } from './util';

const postAdmissionOpenSposts = session => {
	return session.post_admission_quota - session.pa_participants;
}

const admissionOpenSpots = session => {
	return session.max_participants - session.participants;
}

const postAdmissionAvailable = session => {
	return session.post_admission_end_date &&
		session.post_admission_start_date &&
		session.post_admission_active &&
		session.post_admission_quota;
}

export const isPostAdmissionActive = session => {
	return postAdmissionAvailable(session) &&
		nowBetweenDates(moment(session.post_admission_start_date), moment(session.post_admission_end_date));
}

export const isAdmissionActive = session => {
	return session.registration_end_date &&
		session.registration_start_date &&
		session.open &&
		nowBetweenDates(moment(session.registration_start_date), moment(session.registration_end_date));
}

export const admissionNotStarted = session => {
	return (session.registration_start_date && moment(session.registration_start_date) > moment())
		|| (moment(session.registration_start_date).isSame(moment(), 'day') && !session.open);
}
export const admissionClosed = session => {
	return (session.registration_end_date && moment(session.registration_end_date).isBefore(moment()) && !session.open);
}


export const showAvailableSpots = session => {
	return spotsAvailableForSession(session) > 0
		&& !admissionClosed(session)
		&& (admissionNotStarted(session) ||
			isPostAdmissionActive(session) ||
			isAdmissionActive(session));
}

export const spotsAvailableForSession = session => {
	return isPostAdmissionActive(session)
		? postAdmissionOpenSposts(session)
		: admissionOpenSpots(session);
}

export const admissionActiveAndQueueNotFull = session => {
	return isAdmissionActive(session) && !session.queue_full;
}

export const canSignupForPostAdmission = session => {
	return isPostAdmissionActive(session) && postAdmissionOpenSposts(session) > 0;
}

export const signupPossible = session => {
	// For now a session that has a registration period in the future is read as being open
	// Reason for this is  ui design where signup button takes you to order an email notification
	// Should be changed for something more usable 
	return spotsAvailableForSession(session) > 0 && (admissionNotStarted(session) || isAdmissionActive(session) || (postAdmissionAvailable(session) && isPostAdmissionActive(session)));
}