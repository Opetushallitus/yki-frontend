import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import classes from './ExamSessions.module.css';
import Page from '../../hoc/Page/Page';
import UpcomingExamSessions from '../../components/UpcomingExamSessions/UpcomingExamSessions';
import ExamSessionDetails from './ExamSessionDetails/ExamSessionDetails';
import ExamSessionOrganizer from '../../components/ExamSessionOrganizer/ExamSessionOrganizer';
import ExamSessionForm from '../../components/ExamSessionForm/ExamSessionForm';
import Spinner from '../../components/UI/Spinner/Spinner';
import Modal from '../../components/UI/Modal/Modal';
import Button from '../../components/UI/Button/Button';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import { getLocalizedName } from '../../util/registryUtil';
import * as actions from '../../store/actions/index';

class ExamSessions extends Component {
  state = {
    showAddExamSessionModal: false,
    showExamSessionDetailsModal: false,
    selectedExamSessionId: null,
  };

  componentDidMount = () => {
    this.props.onFetchExamSessionContent();
  };

  componentDidUpdate = prevProps => {
    // close open modals in case of error
    if (!prevProps.error && this.props.error) {
      if (this.state.showExamSessionDetailsModal) {
        this.closeExamSessionDetailsModalHandler();
      }
      if (this.state.showAddExamSessionModal) {
        this.closeAddExamSessionModalHandler();
      }
    }
  };

  openAddExamSessionModalHandler = () =>
    this.setState({ showAddExamSessionModal: true });

  closeAddExamSessionModalHandler = () =>
    this.setState({ showAddExamSessionModal: false });

  openExamSessionDetailsModalHandler = examSession =>
    this.setState({
      selectedExamSession: examSession,
      showExamSessionDetailsModal: true,
    });

  closeExamSessionDetailsModalHandler = () => {
    this.setState({ showExamSessionDetailsModal: false });
    this.props.onFetchExamSessionContent();
  };

  createExamSessionHandler = examSession => {
    this.props.onAddExamSession(
      examSession,
      this.props.examSessionContent.organization.oid,
    );
    this.closeAddExamSessionModalHandler();
  };

  updateExamSessionHandler = examSession => {
    this.props.onUpdateExamSession(
      examSession,
      this.props.examSessionContent.organization.oid,
    );
    this.closeExamSessionDetailsModalHandler();
  };

  deleteExamSessionHandler = () => {
    this.props.onDeleteExamSession(
      this.props.examSessionContent.organization.oid,
      this.state.selectedExamSession.id,
    );
    this.closeExamSessionDetailsModalHandler();
  };

  togglePastExamSessionsHandler = () => {
    const days = !this.props.showPastSessionsFromDays ? 180 : null;
    this.props.toggleAndFetchPastExamSessions(days);
  }

  render() {
    const addExamSessionModal = (
      <React.Fragment>
        {this.state.showAddExamSessionModal ? (
          <Modal
            show={this.state.showAddExamSessionModal}
            modalClosed={this.closeAddExamSessionModalHandler}
          >
            <ExamSessionForm
              examSessionContent={this.props.examSessionContent}
              onSubmit={this.createExamSessionHandler}
            />
          </Modal>
        ) : null}
      </React.Fragment>
    );

    const examSessionDetailsModal = (
      <React.Fragment>
        {this.state.showExamSessionDetailsModal ? (
          <Modal
            show={this.state.showExamSessionDetailsModal}
            modalClosed={this.closeExamSessionDetailsModalHandler}
          >
            <ExamSessionDetails
              examSession={this.props.examSessionContent.examSessions.find(es => es.id === this.state.selectedExamSession.id)}
              oid={this.props.examSessionContent.organization.oid}
              onSubmitUpdateExamSession={this.updateExamSessionHandler}
              onSubmitDeleteExamSession={this.deleteExamSessionHandler}
            />
          </Modal>
        ) : null}
      </React.Fragment>
    );

    const content = this.props.loading ? (
      <Spinner />
    ) : this.props.examSessionContent.organizer ? (
      <div className={classes.ExamSessions}>
        <div>
          <h1 data-cy="exam-session-header">
            {getLocalizedName(
              this.props.examSessionContent.organization.nimi,
              this.props.i18n.lang,
            )}
          </h1>
          <UpcomingExamSessions
            examSessions={this.props.examSessionContent.examSessions}
            examSessionSelected={this.openExamSessionDetailsModalHandler}
            showPastExamSessions={!!this.props.showPastSessionsFromDays}
            togglePastExamSessions={this.togglePastExamSessionsHandler}
          />
          <div
            className={classes.AddExamSessionButton}
            data-cy="add-exam-session-button"
          >
            <Button clicked={this.openAddExamSessionModalHandler}>
              {this.props.t('examSession.addExamSession')}
            </Button>
          </div>
          <h2 className={classes.ContractTitle}>{this.props.t('common.agreement')}</h2>
          <ExamSessionOrganizer
            organizer={this.props.examSessionContent.organizer}
            organization={this.props.examSessionContent.organization}
          />
        </div>
      </div>
    ) : (
          <p>{this.props.t('examSessions.agreementNotFound')}</p>
        );

    return (
      <Page>
        <div className={classes.ExamSessions}>
          {addExamSessionModal}
          {examSessionDetailsModal}
          {content}
        </div>
      </Page >
    );
  }
}

const mapStateToProps = state => {
  return {
    examSessionContent: state.exam.examSessionContent,
    loading: state.exam.loading,
    error: state.exam.error,
    showPastSessionsFromDays: state.exam.showPastSessionsFromDays,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchExamSessionContent: () =>
      dispatch(actions.fetchExamSessionContent()),
    errorConfirmedHandler: () => dispatch(actions.examSessionFailReset()),
    onAddExamSession: (examSession, oid) =>
      dispatch(actions.addExamSession(examSession, oid)),
    onUpdateExamSession: (examSession, oid) =>
      dispatch(actions.updateExamSession(examSession, oid)),
    onDeleteExamSession: (oid, examSessionId) =>
      dispatch(actions.deleteExamSession(oid, examSessionId)),
    toggleAndFetchPastExamSessions: (activeState) =>
      dispatch(actions.toggleAndFetchPastExamSessions(activeState)),
  };
};

ExamSessions.propTypes = {
  examSessionContent: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  onFetchExamSessionContent: PropTypes.func.isRequired,
  errorConfirmedHandler: PropTypes.func.isRequired,
  onAddExamSession: PropTypes.func.isRequired,
  onUpdateExamSession: PropTypes.func.isRequired,
  onDeleteExamSession: PropTypes.func.isRequired,
  toggleAndFetchPastExamSessions: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(withErrorHandler(ExamSessions)));
