import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import moment from 'moment';

import classes from './ExamSessionDetails.module.css';
import { DATE_FORMAT } from '../../../common/Constants';
import { getLanguagesWithLevelDescriptions } from '../../../util/util';
import Spinner from '../../../components/UI/Spinner/Spinner';
import ParticipantList from '../../../components/UpcomingExamSessions/ParticipantList/ParticipantList';
import ExamSessionUpdateForm from './ExamSessionUpdateForm/ExamSessionUpdateForm';
import * as actions from '../../../store/actions/index';

export class ExamSessionDetails extends Component {
  componentDidMount = () => {
    this.props.onFetchExamSessionParticipants(
      this.props.examSession.organizer_oid,
      this.props.examSession.id,
    );
  };

  render() {
    return (
      <div data-cy="exam-session-details">
        <h2 className={classes.ExamSessionDetailsHeader}>
          {this.props.t('examSession')}{': '}
          {getLanguagesWithLevelDescriptions([
            this.props.examSession,
          ])[0].toLowerCase()}{' '}
          {moment(this.props.examSession.session_date).format(DATE_FORMAT)}
        </h2>
        <ExamSessionUpdateForm onSubmit={this.props.onSubmitUpdateExamSession} onDelete={this.props.onSubmitDeleteExamSession} examSession={this.props.examSession}/>
        {this.props.loading ? (
          <Spinner />
        ) : (
          <ParticipantList
            examSession={this.props.examSession}
            participants={this.props.participants}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    participants: state.exam.participants,
    loading: state.exam.loading,
    error: state.exam.error,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchExamSessionParticipants: (organizerOid, examSessionId) =>
      dispatch(
        actions.fetchExamSessionParticipants(organizerOid, examSessionId),
      ),
    errorConfirmedHandler: () =>
      dispatch(actions.examSessionFailReset()),
  };
};

ExamSessionDetails.propTypes = {
  examSession: PropTypes.object.isRequired,
  participants: PropTypes.array,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  onFetchExamSessionParticipants: PropTypes.func.isRequired,
  onSubmitUpdateExamSession: PropTypes.func.isRequired,
  onSubmitDeleteExamSession: PropTypes.func.isRequired,
  errorConfirmedHandler: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withNamespaces()(ExamSessionDetails));
