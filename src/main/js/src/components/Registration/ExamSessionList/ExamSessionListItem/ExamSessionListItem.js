import React from 'react';
import moment from 'moment';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import classes from './ExamSessionListItem.module.css';
import { nowBetweenDates, levelDescription } from '../../../../util/util';
import {
  DATE_FORMAT,
  DATE_FORMAT_WITHOUT_YEAR,
} from '../../../../common/Constants';

const examSessionListItem = ({ examSession: session, language, t }) => {
  const date = (
    <div className={classes.Date}>
      {moment(session.session_date).format(DATE_FORMAT)}
    </div>
  );
  const exam = (
    <div className={classes.Exam}>
      <strong>{`${language.name}, ${levelDescription(
        session.level_code,
      ).toLowerCase()}`}</strong>
    </div>
  );
  const name = session.location[0].name;
  const address = session.location[0].address.split(',')[0] || '';
  const city = session.location[0].address.split(' ').pop() || '';
  const location = (
    <span className={classes.Location}>
      {name} <br /> {address} <br /> <strong>{city}</strong>
    </span>
  );
  const spotsAvailable = session.max_participants - session.participants;
  const availability = (
    <div className={classes.Availability}>
      <strong>
        {spotsAvailable ? (
          <React.Fragment>
            <span>{spotsAvailable}</span>{' '}
            <span className={classes.HiddenOnDesktop}>
              {spotsAvailable === 1
                ? t('registration.examSpots.singleFree')
                : t('registration.examSpots.free')}
            </span>
          </React.Fragment>
        ) : (
          <span>{t('registration.examSpots.full')}</span>
        )}
      </strong>
    </div>
  );

  const registrationOpen = (
    <div className={classes.RegistrationOpen}>
      <span className={classes.HiddenOnDesktop}>{t('registration.open')}</span>{' '}
      <span>
        {`${moment(session.registration_end_date).format(
          DATE_FORMAT_WITHOUT_YEAR,
        )} - ${moment(session.registration_start_date).format(
          DATE_FORMAT_WITHOUT_YEAR,
        )}`}
      </span>
    </div>
  );

  const registrationCurrentlyOpen = nowBetweenDates(
    session.registration_start_date,
    session.registration_end_date,
  );
  const registerButton = (
    <button
      className={[
        classes.RegisterButton,
        !registrationCurrentlyOpen
          ? classes.RegistrationLocked
          : spotsAvailable
          ? classes.ButtonForSignup
          : classes.ButtonForQueue,
      ].join(' ')}
    >
      {spotsAvailable
        ? t('registration.register')
        : t('registration.register.forQueue')}
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

export default withTranslation()(examSessionListItem);
