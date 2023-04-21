import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {connect} from 'react-redux';

import {DATE_FORMAT} from '../../../../common/Constants';
import * as actions from '../../../../store/actions/index';
import {useMobileView} from '../../../../util/customHooks';
import {
  getSpotsAvailableForSession,
  hasFullQueue,
  hasRoom,
  isOpen,
  isPostAdmissionActive,
  isRegistrationPeriodEnded,
} from '../../../../util/examSessionUtil';
import {getDeviceOrientation, levelDescription} from '../../../../util/util';
import classes from './ExamSessionListItem.module.css';

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
  const mobile = useMobileView(true, false);
  const tablet = useMobileView(false, true);

  const examFee = `${t('common.price')}: ${session.exam_fee} €`;

  const examLanguage = t(`common.language.${language.code}`);
  const examLevel = levelDescription(session.level_code).toLowerCase();
  const exam = (
    <div>
      <strong>{`${examLanguage}, ${examLevel}`}</strong>
    </div>
  );

  const sessionLocation =
    session.location.find(l => l.lang === i18n.language) || session.location[0];

  const name = sessionLocation.name;
  const address = sessionLocation.street_address || '';
  const city = sessionLocation.post_office.toUpperCase() || '';

  const location = (
    <div className={classes.Location}>
      {name} <br/>
      {address} <br/>
      <strong>{city}</strong>
    </div>
  );

  const showAvailableSpots = hasRoom(session) && !isRegistrationPeriodEnded(session);

  const availableSpots = getSpotsAvailableForSession(session);

  const availableSpotsText = availableSpots === 1
    ? t('registration.examSpots.singleFree')
    : t('registration.examSpots.free');

    const availability = (
      <div>
        <strong>
          {showAvailableSpots ? (
            <>
              <span>{availableSpots}</span>
              {' '}
              <span>{availableSpotsText}</span>
            </>
          ) : (
            <span>{t('registration.examSpots.full')}</span>
          )}
        </strong>
      </div>
    );

    const displayRegistrationPeriod = (startDate, endDate) => {
      const start = moment(startDate).format(DATE_FORMAT);
      const end = moment(endDate).format(DATE_FORMAT);

      if (start !== end) {
        return `${start} ${t('registration.examDetails.card.time')} 10 - ${end} ${t('registration.examDetails.card.time')} 16`;
      }

      return `${start} ${t('registration.examDetails.card.time')} 10 - 16`;
    };

  const displayPostAdmissionPeriod = isPostAdmissionActive(session);

  const registrationPeriodText = displayPostAdmissionPeriod
    ? displayRegistrationPeriod(session.post_admission_start_date, session.post_admission_end_date)
    : displayRegistrationPeriod(session.registration_start_date, session.registration_end_date);

  const registrationPeriodAriaLabelText = displayPostAdmissionPeriod
    ? `${t('examSession.postAdmission')}: ${registrationPeriodText}`
    : `${t('registration.list.signupOpen')}: ${registrationPeriodText}`;

  const registrationOpenDesktop = (
    <div>
      {displayPostAdmissionPeriod && (
        <p>{t('examSession.postAdmission')}:</p>
      )}
      <p>{registrationPeriodText}</p>
    </div>
  );

    const registrationOpenMobile = (
      <div style={{display: 'block'}}>
        <div className={classes.RegistrationOpen}>
          {displayPostAdmissionPeriod ? (
            t('examSession.postAdmission')
          ) : (
            t('registration.list.signupOpen')
          )}
          {':'}
          <span style={{marginLeft: 5}}>
            {registrationPeriodText}
          </span>
        </div>
      </div>
    );

    const getRegistrationButtonText = () => {
      if (availableSpots) {
        return t('registration.register');
      }

      return t('registration.register.forQueue');
    };

    const srLabel = `${getRegistrationButtonText()} ${examLanguage} ${examLevel}. ${examDate}. ${name}, ${address}, ${city}. ${registrationPeriodAriaLabelText}, ${availableSpots} ${availableSpotsText}.`;

    const registerButton = (
      <div>
        {!isRegistrationPeriodEnded(session) && !hasFullQueue(session) && (
          <button
            className={`YkiButton ${classes.RegisterButton}`}
            onClick={selectExamSession}
            role="link"
            aria-label={srLabel}
            disabled={!isOpen(session)}
          >
            {getRegistrationButtonText()}
          </button>
        )}
      </div>
    );

    return (
      <>
        {mobile ||
        tablet ||
        (tablet && getDeviceOrientation() === 'landscape') ? (
          <tr
            className={classes.ExamSessionListItem}
            data-cy="exam-session-list-item"
          >
            <td>
              <div>{exam}</div>
              <div>{date}</div>
            </td>
            <td>{registrationOpenMobile}</td>
            <td>
              <div>{availability}</div>
              <div>{examFee}</div>
            </td>
            <td>
              {location}
              {registerButton}
            </td>
          </tr>
        ) : (
          <tr
            className={classes.ExamSessionListItem}
            data-cy="exam-session-list-item"
          >
            <td>{exam}</td>
            <td>{date}</td>
            <td>{location}</td>
            <td>{registrationOpenDesktop}</td>
            <td>{availability}</td>
            <td>{registerButton}</td>
          </tr>
        )}
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

export default connect(null, mapDispatchToProps)(examSessionListItem);
