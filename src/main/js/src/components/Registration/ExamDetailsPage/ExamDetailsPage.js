import moment from 'moment';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import tempHeroImage from '../../../assets/images/ophYki_image2.png';
import { DATE_FORMAT_WITHOUT_YEAR } from '../../../common/Constants';
import * as actions from '../../../store/actions/index';
import HeadlineContainer from '../../HeadlineContainer/HeadlineContainer';
import Spinner from '../../UI/Spinner/Spinner';
import AuthButton from '../AuthButton/AuthButton';
import BackButton from '../BackButton/BackButton';
import LoginLink from '../LoginLink/LoginLink';
import NotificationSignup from '../NotificationSignup/NotificationSignup';
import ExamDetailsCard from './ExamDetailsCard/ExamDetailsCard';
import classes from './ExamDetailsPage.module.css';
import {
  hasFullQueue,
  hasRoom,
  isOpen,
} from "../../../util/examSessionUtil";
import { levelDescription } from '../../../util/util';

const examDetailsPage = ({
  location,
  session,
  match,
  onfetchExamSession,
  loading,
}) => {
  const [t] = useTranslation();
  const [showLoginLink, setShowLoginLink] = useState(false);

  useEffect(() => {
    document.title = t('registration.document.examDetails.title');
    if (Object.keys(session).length === 0 && !loading) {
      onfetchExamSession(match.params.examSessionId);
    }
  }, []);

  const { status } = queryString.parse(location.search);
  const validationFailed = status && status === 'validation-fail';

  const seatsAvailable = hasRoom(session);
  const queueFull = hasFullQueue(session);
  const examSessionId = Number(match.params.examSessionId);

  const registrationPeriodText = session.registration_start_date !== session.registration_end_date
    ? `${t('registration.examDetails.registrationPeriod')} ${moment(session.registration_start_date).format(DATE_FORMAT_WITHOUT_YEAR)} ${t('registration.examDetails.card.time')} 10.00 - ${moment(session.registration_end_date).format(DATE_FORMAT_WITHOUT_YEAR)} ${t('registration.examDetails.card.time')} 16.00`
    : `${t('registration.examDetails.registrationPeriod')} ${moment(session.registration_start_date).format(DATE_FORMAT_WITHOUT_YEAR)} ${t('registration.examDetails.card.time')} 10.00 - 16.00`;

  const languageAndLevel = (
    <p>{`${t(`common.language.${session.language_code}`)}, ${levelDescription(
      session.level_code,
    ).toLowerCase()}`}</p>
  );

  return (
    <main id="main">
      {loading ? (
        <div className={classes.Loading}>
          <Spinner />
        </div>
      ) : (
        <>
          <HeadlineContainer
            headlineTitle={languageAndLevel.props.children.toString()}
            headlineContent={
              <ExamDetailsCard exam={session} isFull={!seatsAvailable} />
            }
            headlineImage={tempHeroImage}
          />
          <div className={classes.Content}>
            <BackButton href="/yki/ilmoittautuminen/valitse-tutkintotilaisuus" />
            {isOpen(session) ? (
              <>
                {validationFailed && (
                  <div className={classes.NotifyText}>
                    {t('registration.examDetails.validationError.info')}
                  </div>
                )}
                {seatsAvailable && (
                  <div className={classes.InfoText}>
                    <p>{t('registration.examDetails.futureInfo')}</p>
                  </div>
                )}
                {seatsAvailable ? (
                  <div className={classes.Identification}>
                    <p className={classes.IdentificationHeader}>
                      <strong>{t('registration.examDetails.identify')}</strong>
                    </p>
                    <p>{t('registration.examDetails.identify.text1')}</p>
                    <p>{t('registration.examDetails.identify.text2')}</p>
                    <div className={classes.IdentificationButtons}>
                      <AuthButton examSessionId={examSessionId} />
                      {showLoginLink ? (
                        <LoginLink examSessionId={examSessionId} />
                      ) : (
                        <>
                          <button
                            className={'YkiButton'}
                            data-cy="button-show-login-link"
                            onClick={() => setShowLoginLink(true)}
                            role="link"
                          >
                            {t('registration.examDetails.identify.withEmail')}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  !queueFull && (
                    <div style={{ marginTop: 0 }} className={classes.Identification}>
                      <NotificationSignup examSessionId={match.params.examSessionId} />
                    </div>
                  )
                )}
                {queueFull ? (
                  <div
                    className={classes.Identification}
                    style={{ paddingBottom: '5vh' }}
                    data-cy={'exam-details-title'}
                  >
                    <p>
                      <strong>{t('registration.examDetails.queueFull')}</strong>
                    </p>
                  </div>
                ) : null}
              </>
            ) : (
              <div className={classes.InfoText}>
                <p data-cy="exam-details-registrationPeriod">
                  {registrationPeriodText}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </main>
  );
};

const mapStateToProps = state => {
  return {
    session: state.registration.examSession,
    loading: state.registration.loading,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onfetchExamSession: examSessionId =>
      dispatch(actions.fetchExamSession(examSessionId)),
  };
};

examDetailsPage.propTypes = {
  session: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  onfetchExamSession: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(examDetailsPage);
