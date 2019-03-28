import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
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

export class RegistrationPage extends Component {
  componentDidMount() {
    if (!this.props.initData) {
      const examSessionId = this.props.match.params.examSessionId;
      this.props.onInitRegistrationForm(examSessionId);
    }
  }

  render() {
    const initError = this.props.initDataError ? (
      <RegistrationError
        error={this.props.initDataError}
        defaultKey={'registration.init.error.generic'}
      />
    ) : null;

    const successPage = this.props.submitSuccess ? (
      <RegistrationSuccess
        initData={this.props.initData}
        formData={this.props.formData}
      />
    ) : null;

    const registrationPage = this.props.initDataLoading ? (
      <Spinner />
    ) : this.props.initData ? (
      <div className={classes.RegistrationPage}>
        <h2>{this.props.t('registration.examDetails.title')}</h2>
        <ExamDetailsCard
          exam={this.props.initData.exam_session}
          isFull={false}
        />
        <hr />
        <RegistrationForm {...this.props} />
      </div>
    ) : null;

    return (
      <React.Fragment>
        <Header />
        {!successPage && (
          <BackButton clicked={() => this.props.history.push('/')} />
        )}
        <main className={classes.Content}>
          {initError ? initError : successPage ? successPage : registrationPage}
        </main>
      </React.Fragment>
    );
  }
}

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
)(withTranslation()(RegistrationPage));
