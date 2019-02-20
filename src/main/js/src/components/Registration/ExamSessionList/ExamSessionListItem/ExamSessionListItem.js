import React from 'react';
import moment from 'moment';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import classes from './ExamSessionListItem.module.css';
import { nowBetweenDates, levelDescription } from '../../../../util/util';
import { DATE_FORMAT_WITHOUT_YEAR } from '../../../../common/Constants';

const examSessionListItem = ({ examSession: session, language, t }) => {
  console.log(session);
  const exam = (
    <p className={classes.Exam}>
      <strong>{`${language.name}, ${levelDescription(
        session.level_code,
      ).toLowerCase()}`}</strong>
    </p>
  );
  const name = session.location[0].name;
  const address = session.location[0].address.split(',')[0] || '';
  const city = session.location[0].address.split(' ').pop() || '';
  const location = (
    <p className={classes.Location}>
      {name} <br /> {address} <br /> <strong>{city}</strong>
    </p>
  );
  const spotsAvailable = session.max_participants - session.participants;
  const availability = (
    <p className={classes.Availability}>
      {spotsAvailable
        ? `${spotsAvailable} ${
            spotsAvailable === 1
              ? t('registration.examSpots.singleFree')
              : t('registration.examSpots.free')
          }`
        : t('registration.examSpots.full')}
    </p>
  );

  const timetable = (
    <p className={classes.Timetable}>
      {t('registration.open')}{' '}
      {`${moment(session.registration_end_date).format(
        DATE_FORMAT_WITHOUT_YEAR,
      )} - ${moment(session.registration_start_date).format(
        DATE_FORMAT_WITHOUT_YEAR,
      )}`}
    </p>
  );

  const registrationOpen = nowBetweenDates(
    session.registration_start_date,
    session.registration_end_date,
  );
  const registerButton = (
    <button
      className={[
        classes.RegisterButton,
        !registrationOpen
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
      {exam}
      {availability}
      {location}
      {timetable}
      {registerButton}
    </div>
  );
};

examSessionListItem.propTypes = {
  examSession: PropTypes.object.isRequired,
};

export default withTranslation()(examSessionListItem);
