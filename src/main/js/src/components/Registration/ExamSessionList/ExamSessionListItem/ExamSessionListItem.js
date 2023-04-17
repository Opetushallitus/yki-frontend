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
  isAdmissionActive,
  isAdmissionEnded,
  isPostAdmissionActive,
  isPostAdmissionAvailable,
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

  // TODO: this is true also when registration period has ended on the last registration date
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

  const registrationOpenDesktop = (
    <div>
      <p>{displayRegistrationPeriod(session.registration_start_date, session.registration_end_date)}</p>
      {isPostAdmissionAvailable(session) && (
        <p>{displayRegistrationPeriod(session.post_admission_start_date, session.post_admission_end_date)}</p>
      )}
    </div>
  );

    const registrationOpenMobile = (
      <div style={{display: 'block'}}>
        <div className={classes.RegistrationOpen}>
          {t('registration.list.signupOpen')}
          {':'}
          <span style={{marginLeft: 5}}>
            {displayRegistrationPeriod(session.registration_start_date, session.registration_end_date)}
            {isPostAdmissionAvailable(session) && (
              <>
                <br />
                <br />
                {displayRegistrationPeriod(session.post_admission_start_date, session.post_admission_end_date)}
              </>
            )}
          </span>
        </div>
      </div>
    );

    const getRegistrationButtonText = () => {
      if (hasFullQueue(session)) {
        return t('registration.register.queueFull');
      }

      if (!availableSpots) {
        return t('registration.register.forQueue');
      }

      return t('registration.register');
    };

    const registrationOpenText = isAdmissionEnded(session) && isPostAdmissionAvailable(session)
      ? `${t('examSession.postAdmission')}: ${displayRegistrationPeriod(session.post_admission_start_date, session.post_admission_end_date)}`
      : `${t('registration.list.signupOpen')}: ${displayRegistrationPeriod(session.registration_start_date, session.registration_end_date)}`;

    const srLabel = `${getRegistrationButtonText()} ${examLanguage} ${examLevel}. ${examDate}. ${name}, ${address}, ${city}. ${registrationOpenText}, ${availableSpots} ${availableSpotsText}.`;

    const registerButtonEnabled = (isAdmissionActive(session) || isPostAdmissionActive(session)) && !hasFullQueue(session);

    const registerButton = (
      <div>
        {!isRegistrationPeriodEnded(session) && (
          <button
            className={`YkiButton ${classes.RegisterButton}`}
            onClick={selectExamSession}
            role="link"
            aria-label={srLabel}
            disabled={!registerButtonEnabled}
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
              {hasFullQueue(session) ? null : (
                <div>{examFee}</div>
              )}
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
