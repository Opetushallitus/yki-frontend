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
    if (!this.props.formInitData) {
      const examSessionId = this.props.match.params.examSessionId;
      this.props.onInitRegistrationForm(examSessionId);
    }
  }

  render() {
    const content = this.props.loading ? (
      <Spinner />
    ) : this.props.formInitData ? (
      <div className={classes.RegistrationPage}>
        <div>Exam session details</div>
        <hr/>
        <RegistrationForm formInitData={this.props.formInitData} />
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
    formInitData: state.registration.formInitData,
    loading: state.registration.formInitDataLoading,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onInitRegistrationForm: examSessionId =>
      dispatch(actions.initRegistrationForm(examSessionId)),
  };
};

RegistrationPage.propTypes = {
  match: PropTypes.object.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RegistrationPage);
