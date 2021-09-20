import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { DATE_FORMAT } from '../../../../common/Constants';
import * as actions from '../../../../store/actions/index';
import { useMobileView } from '../../../../util/customHooks';
import {
  admissionActiveAndQueueNotFull,
  admissionNotStarted,
  canSignupForPostAdmission,
  isAdmissionActive,
  isPostAdmissionActive,
  showAvailableSpots,
  spotsAvailableForSession,
} from '../../../../util/examSessionUtil';
import { getDeviceOrientation, levelDescription } from '../../../../util/util';
import classes from './ExamSessionListItem.module.css';
import * as i18nKeys from "../../../../common/LocalizationKeys";

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

  const examFee = `${t(i18nKeys.common_price)}: ${session.exam_fee} €`;

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
    <div>
      <span className={classes.Location}>
        {name} <br /> {address} <br /> {session.location[0].zip}{' '}
        <strong>{city}</strong>
      </span>
    </div>
  );

  const spotsAvailable = spotsAvailableForSession(session);

  const spotsAvailableText =
    spotsAvailable === 1
      ? t(i18nKeys.registration_examSpots_singleFree)
      : t(i18nKeys.registration_examSpots_free);

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
          <span>{t(i18nKeys.registration_examSpots_full)}</span>
        )}
      </strong>
    </div>
  );

  const registrationOpenDesktop = (
    <div>
      {session.post_admission_start_date &&
      session.post_admission_end_date &&
      session.post_admission_active ? (
        <>
          <p>{`${moment(session.post_admission_start_date).format(
            DATE_FORMAT,
          )} -
                    ${moment(session.post_admission_end_date).format(
                      DATE_FORMAT,
                    )}`}</p>
          <p>{t(i18nKeys.registration_postregistrationOnGoing)}</p>
        </>
      ) : (
        <>
          <p>{`${moment(session.registration_start_date).format(
            DATE_FORMAT,
          )} - ${moment(session.registration_end_date).format(
            DATE_FORMAT,
          )}`}</p>
          <p>{t(i18nKeys.registration_open)}</p>
        </>
      )}
    </div>
  );

  const registrationOpenMobile = (
    <div style={{ display: 'block' }}>
      <div className={classes.RegistrationOpen}>
        {t(i18nKeys.registration_list_signupOpen)}
        {':'}

        <span style={{ marginLeft: 5 }}>{`${moment(
          session.registration_start_date,
        ).format(DATE_FORMAT)} - ${moment(session.registration_end_date).format(
          DATE_FORMAT,
        )}`}</span>
      </div>
      {session.post_admission_start_date &&
        session.post_admission_end_date &&
        session.post_admission_active && (
          <div className={classes.RegistrationOpen}>
            {t(i18nKeys.examSession_postAdmission)}
            {':'}
            <span style={{ marginLeft: 5 }}>
              {`${moment(session.post_admission_start_date).format(
                DATE_FORMAT,
              )} -
                    ${moment(session.post_admission_end_date).format(
                      DATE_FORMAT,
                    )}`}
            </span>
          </div>
        )}
    </div>
  );

  const buttonText = spotsAvailable
    ? t(i18nKeys.registration_register)
    : session.queue_full
    ? t(i18nKeys.registration_register_queueFull)
    : t(i18nKeys.registration_register_forQueue);

  const registrationOpenText =
    session.post_admission_start_date &&
    session.post_admission_end_date &&
    session.post_admission_active
      ? `${t(i18nKeys.examSession_postAdmission)}:  ${moment(
          session.post_admission_start_date,
        ).format(DATE_FORMAT)} -
                    ${moment(session.post_admission_end_date).format(
                      DATE_FORMAT,
                    )} `
      : `${t(i18nKeys.registration_list_signupOpen)}: ${moment(
          session.registration_start_date,
        ).format(DATE_FORMAT)} - ${moment(session.registration_end_date).format(
          DATE_FORMAT,
        )}`;

  const srLabel = `${buttonText} ${examLanguage} ${examLevel}. ${examDate}. ${name}, ${address}, ${city}. ${registrationOpenText}, ${spotsAvailable} ${spotsAvailableText}.`;

  const showRegisterButton =
    admissionNotStarted(session) ||
    admissionActiveAndQueueNotFull(session) ||
    canSignupForPostAdmission(session);

  const registerButton = (
    <div>
      {showRegisterButton ? (
        <button
          className={`YkiButton ${classes.RegisterButton}`}
          onClick={selectExamSession}
          role="link"
          aria-label={srLabel}
          disabled={
            !isAdmissionActive(session) && !isPostAdmissionActive(session)
          }
        >
          {buttonText}
        </button>
      ) : null}
    </div>
  );
  const locationOnMobileView = (
    <div className={classes.Location}>
      <span>
        {name}
        <br />
        {address}
        <br />
      </span>
      <span>
        {session.location[0].zip} {city}
      </span>
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
          <td className={classes.MobileRow}>
            <div>{exam}</div>
            <div>{date}</div>
          </td>
          <td>{registrationOpenMobile}</td>

          <td className={classes.MobileRow}>
            <div>{availability}</div>
            {session.queue_full ? null : (
              <div className={classes.ExamFee}>{examFee}</div>
            )}
          </td>
          <td>
            {locationOnMobileView}
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
