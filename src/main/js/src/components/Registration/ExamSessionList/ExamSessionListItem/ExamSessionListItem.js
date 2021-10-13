import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {connect} from 'react-redux';

import {DATE_FORMAT} from '../../../../common/Constants';
import * as actions from '../../../../store/actions/index';
import {useMobileView} from '../../../../util/customHooks';
import {
    admissionActiveAndQueueNotFull,
    admissionNotStarted,
    canSignupForPostAdmission,
    isAdmissionActive,
    isPostAdmissionActive,
    showAvailableSpots,
    spotsAvailableForSession,
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
        <div>
            {name} <br/>
            {address} <br/>
            <strong>{city}</strong>
        </div>
    );

    const spotsAvailable = spotsAvailableForSession(session);

    const spotsAvailableText =
        spotsAvailable === 1
            ? t('registration.examSpots.singleFree')
            : t('registration.examSpots.free');

    const availability = (
        <div>
            <strong>
                {showAvailableSpots(session) ? (
                    <>
                        <span>{spotsAvailable}</span>{' '}
                        <span>{spotsAvailableText}</span>
                    </>
                ) : (
                    <span>{t('registration.examSpots.full')}</span>
                )}
            </strong>
        </div>
    );

    const fmtDateRange = (startDate, endDate) => {
        const start = moment(startDate).format(DATE_FORMAT);
        const end = moment(endDate).format(DATE_FORMAT);
        return `${start} - ${end}`;
    };

    const showTextIfDateRangeNow = (startDate, endDate, text) => {
        if (moment().isBetween(moment(startDate), moment(endDate).endOf('day'))) {
            return <p>{text}</p>;
        }
    }

    const registrationOpenDesktop = (
        <div>
            {session.post_admission_start_date &&
            session.post_admission_end_date &&
            session.post_admission_active
                ? <>
                    <p>{fmtDateRange(session.post_admission_start_date, session.post_admission_end_date)}</p>
                    {showTextIfDateRangeNow(session.post_admission_start_date, session.post_admission_end_date, t('registration.postregistrationOnGoing'))}
                </>
                : <>
                    <p>{fmtDateRange(session.registration_start_date, session.registration_end_date)}</p>
                    {showTextIfDateRangeNow(session.registration_start_date, session.registration_end_date, t('registration.open'))}
                </>
            }
        </div>
    );

    const registrationOpenMobile = (
        <div style={{display: 'block'}}>
            <div className={classes.RegistrationOpen}>
                {t('registration.list.signupOpen')}
                {':'}

                <span style={{marginLeft: 5}}>
            {fmtDateRange(session.registration_start_date, session.registration_end_date)}
        </span>
            </div>
            {session.post_admission_start_date &&
            session.post_admission_end_date &&
            session.post_admission_active && (
                <div className={classes.RegistrationOpen}>
                    {t('examSession.postAdmission')}
                    {':'}
                    <span style={{marginLeft: 5}}>
                {fmtDateRange(session.post_admission_start_date, session.post_admission_end_date)}
            </span>
                </div>
            )}
        </div>
    );

    const buttonText = spotsAvailable
        ? t('registration.register')
        : session.queue_full
            ? t('registration.register.queueFull')
            : t('registration.register.forQueue');

    const registrationOpenText =
        session.post_admission_start_date &&
        session.post_admission_end_date &&
        session.post_admission_active
            ? `${t('examSession.postAdmission')}: ${fmtDateRange(session.post_admission_start_date, session.post_admission_end_date)}`
            : `${t('registration.list.signupOpen')}: ${fmtDateRange(session.registration_start_date, session.registration_end_date)}`;

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
        <div className={classes.LocationMobile}>
            {name} <br/>
            {address} <br/>
            <strong>{city}</strong>
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
                        {session.queue_full ? null : (
                            <div>{examFee}</div>
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
