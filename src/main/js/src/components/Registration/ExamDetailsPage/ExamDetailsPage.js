import React, { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';

import classes from './ExamDetailsPage.module.css';
import Spinner from '../../UI/Spinner/Spinner';
import * as actions from '../../../store/actions/index';
import Header from '../../Header/Header';
import BackButton from '../BackButton/BackButton';
import ExamDetailsCard from './ExamDetailsCard/ExamDetailsCard';
import AuthButton from '../AuthButton/AuthButton';
import NotificationSignup from '../NotificationSignup/NotificationSignup';
import LoginLink from '../LoginLink/LoginLink';
import { DATE_FORMAT_WITHOUT_YEAR } from '../../../common/Constants';

const examDetailsPage = ({
  session,
  history,
  match,
  onfetchExamSession,
  loading,
}) => {
  const [t] = useTranslation();
  const [showLoginLink, setShowLoginLink] = useState(false);

  useEffect(() => {
    document.title = t('registration.document.examDetails.title');
    if (Object.keys(session).length === 0) {
      onfetchExamSession(match.params.examSessionId);
    }
  }, []);

  const seatsAvailable = session.max_participants - session.participants > 0;
  const registrationOpen = session.open;
  const examSessionId = Number(match.params.examSessionId);

  const registrationPeriod = (
    <div className={classes.InfoText}>
      <p data-cy="exam-details-registrationPeriod">{`${t(
        'registration.examDetails.registrationPeriod',
      )} ${moment(session.registration_start_date).format(
        DATE_FORMAT_WITHOUT_YEAR,
      )} ${t('registration.examDetails.card.time')} 10.00 - ${moment(session.registration_end_date).format(
        DATE_FORMAT_WITHOUT_YEAR,
      )} ${t('registration.examDetails.card.time')} 16.00`}</p>
    </div>
  );

  return (
    <div>
      <Header />
      <BackButton
        clicked={() =>
          history.push('/ilmoittautuminen/valitse-tutkintotilaisuus')
        }
      />
      <main className={classes.Content}>
        {loading ? (
          <div className={classes.Loading}>
            <Spinner />
          </div>
        ) : (
          <Fragment>
            <h2 className={classes.Title} data-cy="exam-details-title">
              {!registrationOpen
                ? t('registration.examDetails.registrationClosed')
                : seatsAvailable
                ? t('registration.examDetails.title')
                : t('registration.examDetails.examFull')}
            </h2>
            <ExamDetailsCard exam={session} isFull={!seatsAvailable} />
            {registrationOpen ? (
              <Fragment>
                <div className={classes.InfoText}>
                  {seatsAvailable && (
                    <p>{t('registration.examDetails.futureInfo')}</p>
                  )}
                </div>
                <hr />
                {seatsAvailable ? (
                  <div className={classes.Identification}>
                    <p>
                      <strong>{t('registration.examDetails.identify')}</strong>
                    </p>
                    <AuthButton examSessionId={examSessionId} />
                    {showLoginLink ? (
                      <LoginLink examSessionId={examSessionId} />
                    ) : (
                      <Fragment>
                        <button
                          className={classes.EmailIdentificationButton}
                          data-cy="button-show-login-link"
                          onClick={() => setShowLoginLink(true)}
                          role="link"
                        >
                          {t('registration.examDetails.identify.withEmail')}
                        </button>
                      </Fragment>
                    )}
                  </div>
                ) : (
                  <NotificationSignup
                    examSessionId={match.params.examSessionId}
                  />
                )}
              </Fragment>
            ) : (
              registrationPeriod
            )}
          </Fragment>
        )}
      </main>
    </div>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(examDetailsPage);
