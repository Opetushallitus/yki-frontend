import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import * as actions from '../../../store/actions/index';
import RegistrationForm from '../../../components/Registration/RegistrationForm/RegistrationForm';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Header from '../../../components/Header/Header';
import BackButton from '../../../components/Registration/BackButton/BackButton';
import classes from './RegistrationPage.module.css';
import RegistrationSuccess from '../../../components/Registration/RegistrationSuccess/RegistrationSuccess';
import RegistrationError from '../../../components/Registration/RegistrationError/RegistrationError';
import ExamDetailsCard from '../../../components/Registration/ExamDetailsPage/ExamDetailsCard/ExamDetailsCard';

export const RegistrationPage = props => {
  const { t } = useTranslation();

  useEffect(() => {
    if (!props.initData) {
      const examSessionId = props.match.params.examSessionId;
      props.onInitRegistrationForm(examSessionId);
    }
  }, []);

  const initError = props.initDataError ? (
    <RegistrationError
      error={props.initDataError}
      defaultKey={'registration.init.error.generic'}
    />
  ) : null;

  const successPage = props.submitSuccess ? (
    <RegistrationSuccess initData={props.initData} formData={props.formData} />
  ) : null;

  const registrationPage = props.initDataLoading ? (
    <Spinner />
  ) : props.initData ? (
    <div className={classes.RegistrationPage}>
      <h2>{t('registration.examDetails.title')}</h2>
      <ExamDetailsCard exam={props.initData.exam_session} isFull={false} />
      <hr />
      <RegistrationForm {...props} />
    </div>
  ) : null;

  return (
    <React.Fragment>
      <Header />
      {!successPage && <BackButton clicked={() => props.history.push('/')} />}
      <main className={classes.Content}>
        {initError ? initError : successPage ? successPage : registrationPage}
      </main>
    </React.Fragment>
  );
};

const mapStateToProps = state => {
  return {
    initData: state.registration.form.initData,
    formData: state.registration.form.formData,
    initDataLoading: state.registration.form.initDataLoading,
    initDataError: state.registration.form.initDataError,
    submitResponse: state.registration.form.submitResponse,
    submitSuccess: state.registration.form.submitSuccess,
    submitting: state.registration.form.submitting,
    submitError: state.registration.form.submitError,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onInitRegistrationForm: examSessionId =>
      dispatch(actions.initRegistrationForm(examSessionId)),
    onSubmitRegistrationForm: (registrationId, registrationForm) =>
      dispatch(
        actions.submitRegistrationForm(registrationId, registrationForm),
      ),
  };
};

RegistrationPage.propTypes = {
  match: PropTypes.object.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RegistrationPage);
