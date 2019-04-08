import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import classes from './ExamSessionListItem.module.css';
import { levelDescription } from '../../../../util/util';
import {
  DATE_FORMAT,
  DATE_FORMAT_WITHOUT_YEAR,
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
  const city = sessionLocation.post_office || '';
  const location = (
    <span className={classes.Location}>
      {name} <br /> {address} <br /> <strong>{city}</strong>
    </span>
  );

  const spotsAvailable = session.max_participants - session.participants;

  const spotsAvailableText =
    spotsAvailable === 1
      ? t('registration.examSpots.singleFree')
      : t('registration.examSpots.free');
  const availability = (
    <div className={classes.Availability}>
      <strong>
        {spotsAvailable > 0 ? (
          <Fragment>
            <span>{spotsAvailable}</span>{' '}
            <span className={classes.HiddenOnDesktop}>
              {spotsAvailableText}
            </span>
          </Fragment>
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
      </span>
    </div>
  );

  const buttonText = spotsAvailable
    ? t('registration.register')
    : session.queue_full
    ? 'Jono täynnä'
    : t('registration.register.forQueue');
  const srLabel = `${buttonText} ${examLanguage} ${examLevel}. ${examDate}. ${name}, ${address}, ${city}. ${spotsAvailable} ${spotsAvailableText}.`;
  const registerButton = (
    <button
      className={[
        classes.RegisterButton,
        !session.open || session.queue_full
          ? classes.RegistrationLocked
          : spotsAvailable
          ? classes.ButtonForSignup
          : classes.ButtonForQueue,
      ].join(' ')}
      onClick={selectExamSession}
      role="link"
      aria-label={srLabel}
    >
      {buttonText}
    </button>
  );

  return (
    <div
      className={classes.ExamSessionListItem}
      data-cy="exam-session-list-item"
    >
      {date}
      {exam}
      {availability}
      {location}
      {registrationOpen}
      {registerButton}
    </div>
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
