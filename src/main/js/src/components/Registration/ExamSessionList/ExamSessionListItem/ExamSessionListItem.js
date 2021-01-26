import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import {
  canSignupForPostAdmission,
  admissionNotStarted,
  showAvailableSpots,
  admissionActiveAndQueueNotFull,
  spotsAvailableForSession,
} from '../../../../util/examSessionUtil';
import classes from './ExamSessionListItem.module.css';
import { getDeviceOrientation, levelDescription } from '../../../../util/util';
import {
  DATE_FORMAT,
  DATE_FORMAT_WITHOUT_YEAR, MOBILE_VIEW
} from '../../../../common/Constants';
import * as actions from '../../../../store/actions/index';

const examSessionListItem = ({
  examSession: session,
  language,
  onSelectExamSession,
  history,
}) => {
  const [t, i18n] = useTranslation();

  const selectExamSession = () => {
    onSelectExamSession(session);
    history.push(`/tutkintotilaisuus/${session.id}`);
  };

  const examDate = moment(session.session_date).format(DATE_FORMAT);
  const date = <div className={classes.Date}>{examDate}</div>;

  const examFee = `${t('common.price')}: ${session.exam_fee} €`;

  const examLanguage = t(`common.language.${language.code}`);
  const examLevel = levelDescription(session.level_code).toLowerCase();
  const exam = (
    <div className={classes.Exam}>
      <strong>{`${examLanguage}, ${examLevel}`}</strong>
    </div>
  );

  const sessionLocation =
    session.location.find(l => l.lang === i18n.language) || session.location[0];
  const name = sessionLocation.name;
  const address = sessionLocation.street_address || '';
  const city = sessionLocation.post_office.toUpperCase() || '';
  const location = (
    <span className={classes.Location}>
      {name} <br /> {address} <br /> {session.location[0].zip} <strong>{city}</strong>
    </span>
  );

  const postAdmissionActive = session.post_admission_end_date &&
    session.post_admission_start_date &&
    session.post_admission_active &&
    session.post_admission_quota &&
    nowBetweenDates(moment(session.post_admission_start_date), moment(session.post_admission_end_date));
  const spotsAvailable = postAdmissionActive ? (session.post_admission_quota - session.pa_participants) : (session.max_participants - session.participants);

  const spotsAvailableText =
    spotsAvailable === 1
      ? t('registration.examSpots.singleFree')
      : t('registration.examSpots.free');

  const availability = (
    <div className={classes.Availability}>
      <strong>
        {showAvailableSpots(session) ? (
          <>
            <span>{spotsAvailable}</span>{' '}
            <span className={classes.HiddenOnDesktop}>
              {spotsAvailableText}
            </span>
          </>
        ) : (
            <span>{t('registration.examSpots.full')}</span>
          )}
      </strong>
    </div>
  );

  const registrationOpen = (
    <div className={classes.RegistrationOpen}>
      <span className={classes.HiddenOnDesktop}>
        {t('registration.list.signupOpen')}
      </span>{' '}
      <span>
        {`${moment(session.registration_start_date).format(
          DATE_FORMAT_WITHOUT_YEAR,
        )} - ${moment(session.registration_end_date).format(
          DATE_FORMAT_WITHOUT_YEAR,
        )}`}

        {
          (session.post_admission_start_date && session.post_admission_end_date && session.post_admission_active) ? (
            <>
              <br />
              <span>{`${moment(session.post_admission_start_date).format(DATE_FORMAT_WITHOUT_YEAR)} -
                    ${moment(session.post_admission_end_date).format(DATE_FORMAT_WITHOUT_YEAR)}`}</span>
            </>
          ) : null
        }

      </span>
    </div>
  );

  const buttonText = spotsAvailable
    ? t('registration.register')
    : session.queue_full
      ? t('registration.register.queueFull')
      : t('registration.register.forQueue');
  const srLabel = `${buttonText} ${examLanguage} ${examLevel}. ${examDate}. ${name}, ${address}, ${city}. ${spotsAvailable} ${spotsAvailableText}.`;

  const showRegisterButton = admissionNotStarted(session) ||
    admissionActiveAndQueueNotFull(session) ||
    canSignupForPostAdmission(session);

  const registerButton = (
    <>
      {!admissionClosed(session) && !session.queue_full ?
        <button
          className={'YkiButton'}
          onClick={selectExamSession}
          role="link"
          aria-label={srLabel}
          disabled={!isAdmissionActive(session)}
        >
          {buttonText}
        </button>
        :
        null
      }
    </>
  );
  const locationOnMobileView = (
    <div className={classes.Location}>
      <span>
        {name}<br />{address}<br />
      </span>
      <span>
        {session.location[0].zip}{' '}{city}
      </span>
    </div>
  );

  const mobileLarge = window.innerWidth < 1024;

  return (
    <>
      {MOBILE_VIEW || mobileLarge || (mobileLarge && getDeviceOrientation() === 'landscape') ?
        <div
          className={classes.ExamSessionListItem}
          data-cy="exam-session-list-item"
        >
          <div className={classes.MobileRow}>
            <div>{exam}</div>
            <div>{date}</div>
          </div>
          <hr />
          <div>{registrationOpen}</div>
          <hr />
          <div className={classes.MobileRow}>
            <div>{availability}</div>
            {session.queue_full ? null : <div className={classes.ExamFee}>{examFee}</div>}
          </div>
          <hr />
          <div>
            {locationOnMobileView}
            {registerButton}
          </div>
        </div>
        :
        <div
          className={classes.ExamSessionListItem}
          data-cy="exam-session-list-item"
        >
          {date}
          {location}
          {exam}
          {availability}
          {registrationOpen}
          {registerButton}
        </div>
      }
    </>
  );
};

examSessionListItem.propTypes = {
  examSession: PropTypes.object.isRequired,
};

const mapDispatchToProps = dispatch => {
  return {
    onSelectExamSession: session =>
      dispatch(actions.selectExamSession(session)),
  };
};

export default connect(
  null,
  mapDispatchToProps,
)(examSessionListItem);
