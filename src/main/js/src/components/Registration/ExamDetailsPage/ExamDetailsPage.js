import React, { Fragment, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import classes from './ExamDetailsPage.module.css';
import Spinner from '../../UI/Spinner/Spinner';
import * as actions from '../../../store/actions/index';
import Header from '../../Header/Header';
import BackButton from '../BackButton/BackButton';
import ExamDetailsCard from './ExamDetailsCard/ExamDetailsCard';
import AuthButton from '../AuthButton/AuthButton';

const examDetailsPage = ({
  session,
  history,
  match,
  onfetchExamSession,
  loading,
}) => {
  const [t] = useTranslation();

  useEffect(() => {
    document.title = t('registration.document.examDetails.title');
    if (!Object.keys(session).length) {
      onfetchExamSession(match.params.examSessionId);
    }
  });

  const seatsAvailable = session.max_participants - session.participants > 0;

  return (
    <div>
      <Header />
      <BackButton
        clicked={() => history.push('/ilmoittautuminen/valitse-tutkintotilaisuus')}
      />
      <main className={classes.Content}>
        {loading ? (
          <div className={classes.Loading}>
            <Spinner />
          </div>
        ) : (
          <Fragment>
            <h2 className={classes.Title}>
              {seatsAvailable
                ? t('registration.examDetails.title')
                : t('registration.examDetails.full.title')}
            </h2>
            <ExamDetailsCard exam={session} isFull={!seatsAvailable} />
            <div className={classes.InfoText}>
              {seatsAvailable ? (
                <p>{t('registration.examDetails.futureInfo')}</p>
              ) : (
                <Fragment>
                  <p>
                    <strong>{t('registration.examDetails.examFull')}</strong>
                  </p>
                  <p>{t('registration.examDetails.queueInfo')}</p>
                </Fragment>
              )}
            </div>
            <hr />
            {seatsAvailable ? (
              <div className={classes.Identification}>
                <p>
                  <strong>{t('registration.examDetails.identify')}</strong>
                </p>
                <AuthButton
                  examSessionId={Number(match.params.examSessionId)}
                />
                <button className={classes.EmailIdentificationButton}>
                  {t('registration.examDetails.identify.withEmail')}
                </button>
              </div>
            ) : (
              <div>TODO: signing up for notifications</div>
            )}
          </Fragment>
        )}
      </main>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    session: state.registration.selectedExamSession,
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
