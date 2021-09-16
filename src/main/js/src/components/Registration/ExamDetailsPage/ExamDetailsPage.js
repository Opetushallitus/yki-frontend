import moment from 'moment';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import tempHeroImage from '../../../assets/images/ophYki_image2.png';
import { DATE_FORMAT_WITHOUT_YEAR } from '../../../common/Constants';
import * as actions from '../../../store/actions/index';
import { levelDescription } from '../../../util/util';
import { nowBetweenDates } from '../../../util/util';
import HeadlineContainer from '../../HeadlineContainer/HeadlineContainer';
import Spinner from '../../UI/Spinner/Spinner';
import AuthButton from '../AuthButton/AuthButton';
import BackButton from '../BackButton/BackButton';
import LoginLink from '../LoginLink/LoginLink';
import NotificationSignup from '../NotificationSignup/NotificationSignup';
import ExamDetailsCard from './ExamDetailsCard/ExamDetailsCard';
import classes from './ExamDetailsPage.module.css';

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

  const registrationOpen = session.open;

  const postAdmissionActive =
    registrationOpen &&
    session.post_admission_end_date &&
    session.post_admission_start_date &&
    session.post_admission_active &&
    session.post_admission_quota &&
    nowBetweenDates(
      moment(session.post_admission_start_date),
      moment(session.post_admission_end_date),
    );

  const seatsAvailable = postAdmissionActive
    ? session.post_admission_quota - session.pa_participants > 0
    : session.max_participants - session.participants > 0;

  const queueFull = session.queue_full;
  const examSessionId = Number(match.params.examSessionId);

  const registrationPeriod = (
    <div className={classes.InfoText}>
      <p data-cy="exam-details-registrationPeriod">{`${t(
        'registration.examDetails.registrationPeriod',
      )} ${moment(session.registration_start_date).format(
        DATE_FORMAT_WITHOUT_YEAR,
      )} ${t('registration.examDetails.card.time')} 10.00 - ${moment(
        session.registration_end_date,
      ).format(DATE_FORMAT_WITHOUT_YEAR)} ${t(
        'registration.examDetails.card.time',
      )} 16.00`}</p>
    </div>
  );

  const languageAndLevel = (
    <p>{`${t(`common.language.${session.language_code}`)}, ${levelDescription(
      session.level_code,
    ).toLowerCase()}`}</p>
  );

  /**
   TODO: heroimaget headlineImageksi, kun saadaan OPH:n viestinnältä sopivat kuvat:
    esim enum, joka palauttaa kuvan kielen koodin perusteella:
    headlineImage={languageHeroImages[session.language_code]}
   */
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
            <BackButton href="/ilmoittautuminen/valitse-tutkintotilaisuus" />
            {registrationOpen ? (
              <>
                {validationFailed && (
                  <div className={classes.NotifyText}>
                    {t('registration.examDetails.validationError.info')}
                  </div>
                )}
                <div className={classes.InfoText}>
                  {seatsAvailable && (
                    <p>{t('registration.examDetails.futureInfo')}</p>
                  )}
                  {!seatsAvailable && !queueFull && (
                    <p className={classes.InfoText}>
                      {t('registration.notification.signup.label')}
                    </p>
                  )}
                </div>
                {seatsAvailable ? (
                  <div className={classes.Identification}>
                    <p className={classes.IdentificationHeader}>
                      <strong>{t('registration.examDetails.identify')}</strong>
                    </p>
                    <p>{t('registration.examDetails.additional')}</p>
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
                    <div className={classes.Identification}>
                      <NotificationSignup
                        examSessionId={match.params.examSessionId}
                      />
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
              <>
                {registrationPeriod}
                {/* 
                      Pre registration signup hidden since backend does not support it yet
                    
                    <NotificationSignup
                      examSessionId={match.params.examSessionId}
                      registrationOpen={registrationOpen}
                    /> */}
              </>
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
