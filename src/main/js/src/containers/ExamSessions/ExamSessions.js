import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';

import classes from './ExamSessions.module.css';
import UpcomingExamSessions from '../../components/UpcomingExamSessions/UpcomingExamSessions';
import Spinner from '../../components/UI/Spinner/Spinner';
import { getLocalizedName } from '../../util/registryUtil';
import * as actions from '../../store/actions/index';

class ExamSessions extends Component {
  componentDidMount = () => {
    this.props.onFetchExamSessionContent();
  };

  render() {
    return this.props.loading ? (
      <Spinner />
    ) : this.props.examSessionContent.organizer ? (
      <div className={classes.ExamSessions}>
        <div>
          <h1>
            {getLocalizedName(
              this.props.examSessionContent.organization.nimi,
              this.props.lng,
            )}
          </h1>
          <UpcomingExamSessions
            organizer={this.props.examSessionContent.organizer}
            examSessions={this.props.examSessionContent.examSessions}
          />
        </div>
      </div>
    ) : (
      <div className={classes.ExamSessions}>
        <p>{this.props.t('examSessions.agreementNotFound')}</p>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    examSessionContent: state.exam.examSessionContent,
    loading: state.exam.loading,
    error: state.exam.error,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchExamSessionContent: () =>
      dispatch(actions.fetchExamSessionContent()),
  };
};

ExamSessions.propTypes = {
  onFetchExamSessionContent: PropTypes.func.isRequired,
  examSessionContent: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withNamespaces()(ExamSessions));
