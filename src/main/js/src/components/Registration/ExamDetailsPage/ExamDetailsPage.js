import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';

import classes from './ExamDetailsPage.module.css';
import Spinner from '../../UI/Spinner/Spinner';
import * as actions from '../../../store/actions/index';

import BackButton from '../BackButton/BackButton';

import AuthButton from '../AuthButton/AuthButton';
import NotificationSignup from '../NotificationSignup/NotificationSignup';
import LoginLink from '../LoginLink/LoginLink';
import {DATE_FORMAT_WITHOUT_YEAR} from '../../../common/Constants';
import HeadlineContainer from "../../HeadlineContainer/HeadlineContainer";
import {levelDescription} from "../../../util/util";
import ExamDetailsCard from "./ExamDetailsCard/ExamDetailsCard";

import tempHeroImage from '../../../assets/images/ophYki_image2.png'
// import { nowBetweenDates } from '../../../util/util';

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

  const registrationOpen = session.open;

  /*
  const postAdmissionActive = registrationOpen && 
                              session.post_admission_end_date && 
                              session.post_admission_start_date &&
                              session.post_admission_active &&
                              session.post_admission_quota &&
                              nowBetweenDates(moment(session.post_admission_start_date), moment(session.post_admission_end_date));

   */

  //const seatsAvailable = postAdmissionActive ? (session.post_admission_quota - session.pa_participants) > 0 : (session.max_participants - session.participants) > 0;
  
  const seatsAvailable = (session.max_participants - session.participants) > 0;

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
      <main>
        {loading ? (
            <div className={classes.Loading}>
              <Spinner/>
            </div>
        ) : (
            <>
              <HeadlineContainer
                  headlineTitle={languageAndLevel.props.children.toString()}
                  headlineContent={<ExamDetailsCard exam={session} isFull={!seatsAvailable}/>}
                  headlineImage={tempHeroImage}
              />
              <div className={classes.Content}>
                <BackButton
                    clicked={() =>
                        history.push('/ilmoittautuminen/valitse-tutkintotilaisuus')
                    }
                />
                {registrationOpen ? (
                    <>
                      <div className={classes.InfoText}>
                        {seatsAvailable && (
                            <p>{t('registration.examDetails.futureInfo')}</p>
                        )}
                        {(!seatsAvailable && !queueFull) && (
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
                              <AuthButton examSessionId={examSessionId}/>
                              {showLoginLink ? (
                                  <LoginLink examSessionId={examSessionId}/>
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
                      ) : (!queueFull && (
                              <div className={classes.Identification}>
                                <NotificationSignup
                                    examSessionId={match.params.examSessionId}
                                />
                              </div>
                          )

                      )}
                      {queueFull ?
                        <div className={classes.Identification}
                             style={{paddingBottom: '5vh'}}
                             data-cy={'exam-details-title'}>
                          <p><strong>{t('registration.examDetails.queueFull')}</strong></p>
                        </div>
                        :
                        null
                      }
                    </>
                ) : (
                    <>
                      {registrationPeriod}
                      <NotificationSignup
                        examSessionId={match.params.examSessionId}
                        registrationOpen={registrationOpen}
                      />
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

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(examDetailsPage);
