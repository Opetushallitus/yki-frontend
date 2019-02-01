import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as actions from '../../../store/actions/index';
import RegistrationForm from '../../../components/RegistrationForm/RegistrationForm';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Header from '../../../components/Header/Header';
import BackButton from '../../../components/Registration/BackButton/BackButton';
import classes from './RegistrationPage.module.css';

export class RegistrationPage extends Component {
  componentDidMount() {
    if (!this.props.initData) {
      const examSessionId = this.props.match.params.examSessionId;
      this.props.onInitRegistrationForm(examSessionId);
    }
  }

  render() {
    const content = this.props.initDataLoading ? (
      <Spinner />
    ) : this.props.initData ? (
      <div className={classes.RegistrationPage}>
        <div/>
        <hr/>
        <RegistrationForm {...this.props} />
      </div> 
    ): null;

    return <React.Fragment>
      <Header/>
      <BackButton clicked={e => e} />
      <main className={classes.Content}>
        {content}
      </main>
    </React.Fragment>
  }
}

const mapStateToProps = state => {
  return {
    initData: state.registration.form.initData,
    initDataLoading: state.registration.form.initDataLoading,
    submitResponse: state.registration.form.submitResponse,
    submitting: state.registration.form.submitting,
    submitError: state.registration.form.submitError,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onInitRegistrationForm: examSessionId =>
      dispatch(actions.initRegistrationForm(examSessionId)),
    onSubmitRegistrationForm: registrationForm =>
      dispatch(actions.submitRegistrationForm(registrationForm)),
  };
};

RegistrationPage.propTypes = {
  match: PropTypes.object.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RegistrationPage);
