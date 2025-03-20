import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import moment from 'moment';

import { DATE_FORMAT } from '../../../common/Constants';
import { getLanguagesWithLevelDescriptions } from '../../../util/util';
import Spinner from '../../../components/UI/Spinner/Spinner';
import ParticipantList from '../../../components/ExamSessions/ParticipantList/ParticipantList';
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
    const location = this.props.examSession.location.find(
      l => l.lang === this.props.language,
    );
    return (
      <div data-cy="exam-session-details">
        <h2>{location || this.props.examSession.location[0].name}</h2>
        <h2>
          {this.props.t('examSession')}
          {': '}
          {getLanguagesWithLevelDescriptions([
            this.props.examSession,
          ])[0].toLowerCase()}{' '}
          {moment(this.props.examSession.session_date).format(DATE_FORMAT)}
        </h2>
        <ExamSessionUpdateForm
          onSubmit={this.props.onSubmitUpdateExamSession}
          onDelete={this.props.onSubmitDeleteExamSession}
          examSession={this.props.examSession}
        />
        {this.props.loading ? (
          <Spinner />
        ) : (
          <ParticipantList
            examSession={this.props.examSession}
            participants={this.props.participants}
            examSessions={this.props.examSessions}
            isAdminView={false}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    participants: state.exam.participants,
    examSessions: state.exam.examSessionContent.examSessions,
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
  };
};

ExamSessionDetails.propTypes = {
  examSession: PropTypes.object.isRequired,
  examSessions: PropTypes.array,
  participants: PropTypes.array,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  oid: PropTypes.string.isRequired,
  onFetchExamSessionParticipants: PropTypes.func.isRequired,
  onSubmitUpdateExamSession: PropTypes.func.isRequired,
  onSubmitDeleteExamSession: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(ExamSessionDetails));
