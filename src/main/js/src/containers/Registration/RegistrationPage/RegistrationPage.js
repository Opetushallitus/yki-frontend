import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as actions from '../../../store/actions/index';

export class RegistrationPage extends Component {
  componentDidMount() {
    if (!this.props.formInitData) {
      const examSessionId = this.props.match.params.examSessionId;
      this.props.onInitRegistrationForm(examSessionId);
    }
  }

  render() {
    return (
      <React.Fragment>
        <div>Exam session details</div>
        <div>Registration form</div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    formInitData: state.registration.formInitData,
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
