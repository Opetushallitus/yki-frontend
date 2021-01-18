import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as actions from '../../../store/actions/index';
import RegistrationForm from '../../../components/Registration/RegistrationForm/RegistrationForm';
import Spinner from '../../../components/UI/Spinner/Spinner';
import BackButton from '../../../components/Registration/BackButton/BackButton';
import classes from './RegistrationPage.module.css';
import RegistrationSuccess from '../../../components/Registration/RegistrationSuccess/RegistrationSuccess';
import RegistrationError from '../../../components/Registration/RegistrationError/RegistrationError';
import ExamDetailsCard from '../../../components/Registration/ExamDetailsPage/ExamDetailsCard/ExamDetailsCard';
import YkiImage2 from "../../../assets/images/ophYki_image2.png";
import HeadlineContainer from "../../../components/HeadlineContainer/HeadlineContainer";
import { getLanguageAndLevel } from "../../../util/util";

export const RegistrationPage = props => {
  const { initData, history, match } = props;

  useEffect(() => {
    if (!initData) {
      const examSessionId = match.params.examSessionId;
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
    <RegistrationSuccess initData={initData} formData={props.formData} />
  ) : null;

  const registrationPage = props.initDataLoading ? (
    <Spinner />
  ) : initData ? (
    <>
      <HeadlineContainer
        headlineTitle={getLanguageAndLevel(initData.exam_session)}
        headlineContent={<ExamDetailsCard exam={initData.exam_session} isFull={false} />}
        headlineImage={YkiImage2}
      />
      <div className={classes.RegistrationPage}>
        <BackButton clicked={() => history.push('/')} />
        <RegistrationForm {...props} />
      </div>
    </>
  ) : null;

  return (
    <>
      {!successPage}
      <main>
        {initError ? initError : successPage ? successPage : registrationPage}
      </main>
    </>
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
