import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import moment from 'moment';

import classes from './ExamSessionDetails.module.css';
import { DATE_FORMAT } from '../../../common/Constants';
import { getLanguagesWithLevelDescriptions } from '../../../util/util';
import Spinner from '../../../components/UI/Spinner/Spinner';
import ParticipantList from '../../../components/ExamSessions/ParticipantList/ParticipantList';
import ExamSessionUpdateForm from './ExamSessionUpdateForm/ExamSessionUpdateForm';
import * as actions from '../../../store/actions/index';
import ExamSessionPostAdmission from './PostAdmission/ExamSessionPostAdmission';

export class ExamSessionDetails extends Component {
  componentDidMount = () => {
    this.props.onFetchExamSessionParticipants(
      this.props.examSession.organizer_oid,
      this.props.examSession.id,
    );
  };

  PostAdmissionHeader = () => {
    if (this.props.examSession.post_admission_end_date && this.props.examSession.post_admission_active) {
      return <h2>{`${this.props.t('examSession.postAdmission')} (${this.props.t('examSession.postAdmission.active')})`}</h2>
    }

    return <h2>{`${this.props.t('examSession.postAdmission')} (${this.props.t('examSession.postAdmission.inactive')})`}</h2>
  }

  render() {
    const location = this.props.examSession.location.find(
      l => l.lang === this.props.language,
    );
    return (
      <div data-cy="exam-session-details">
        <h2 className={classes.ExamSessionDetailsHeader}>
          {location || this.props.examSession.location[0].name}
        </h2>
        <h2 className={classes.ExamSessionDetailsHeader}>
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
        {this.PostAdmissionHeader()}
        {this.props.loading ? <Spinner /> : (
          <>
            <ExamSessionPostAdmission examSession={this.props.examSession} oid={this.props.oid} />
            <ParticipantList
              examSession={this.props.examSession}
              participants={this.props.participants}
              examSessions={this.props.examSessions}
              onCancel={this.props.onCancelRegistration}
              onConfirmPayment={this.props.onConfirmPayment}
              onRelocate={this.props.onRelocate}
              onResendLink={this.props.onResendLink}
            />
          </>
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
    onCancelRegistration: (organizerOid, examSessionId, registrationId) =>
      dispatch(
        actions.cancelRegistration(organizerOid, examSessionId, registrationId),
      ),
    onConfirmPayment: (organizerOid, examSessionId, registrationId) =>
      dispatch(
        actions.confirmPayment(organizerOid, examSessionId, registrationId),
      ),
    onResendLink: (organizerOid, examSessionId, registrationId, emailLang) =>
      dispatch(
        actions.ResendPaymentEmail(organizerOid, examSessionId, registrationId, emailLang),
      ),
    errorConfirmedHandler: () => dispatch(actions.examSessionFailReset()),
    onRelocate: (
      organizerOid,
      examSessionId,
      registrationId,
      toExamSessionId,
    ) =>
      dispatch(
        actions.relocateExamSession(
          organizerOid,
          examSessionId,
          registrationId,
          toExamSessionId,
        ),
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
  onCancelRegistration: PropTypes.func.isRequired,
  onSubmitUpdateExamSession: PropTypes.func.isRequired,
  onSubmitDeleteExamSession: PropTypes.func.isRequired,
  errorConfirmedHandler: PropTypes.func.isRequired,
  onRelocate: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(ExamSessionDetails));
