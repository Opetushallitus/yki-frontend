import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';

import classes from './ExamSessions.module.css';
import Page from '../../hoc/Page/Page';
import UpcomingExamSessions from '../../components/UpcomingExamSessions/UpcomingExamSessions';
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
    showModal: false,
  };

  componentDidMount = () => {
    this.props.onFetchExamSessionContent();
  };

  openModalHandler = () => this.setState({ showModal: true });

  closeModalHandler = () => this.setState({ showModal: false });

  createExamSessionHandler = examSession => {
    this.props.onAddExamSession(
      examSession,
      this.props.examSessionContent.organization.oid,
    );
    this.closeModalHandler();
    this.props.onFetchExamSessionContent();
  };

  render() {
    const addExamSessionModal = (
      <React.Fragment>
        {this.state.showModal ? (
          <Modal
            show={this.state.showModal}
            modalClosed={this.closeModalHandler}
          >
            <ExamSessionForm
              examSessionContent={this.props.examSessionContent}
              onSubmit={this.createExamSessionHandler}
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
              this.props.lng,
            )}
          </h1>
          <UpcomingExamSessions
            organizer={this.props.examSessionContent.organizer}
            examSessions={this.props.examSessionContent.examSessions}
          />
          <div
            className={classes.AddExamSessionButton}
            data-cy="add-exam-session-button"
          >
            <Button clicked={this.openModalHandler}>
              {this.props.t('examSession.addExamSession')}
            </Button>
          </div>
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
          {content}
        </div>
      </Page>
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
    errorConfirmedHandler: () =>
      dispatch(actions.fetchExamSessionContentFailReset()),
    onAddExamSession: (examSession, oid) =>
      dispatch(actions.addExamSession(examSession, oid)),
  };
};

ExamSessions.propTypes = {
  examSessionContent: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  onFetchExamSessionContent: PropTypes.func.isRequired,
  errorConfirmedHandler: PropTypes.func.isRequired,
  onAddExamSession: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withNamespaces()(withErrorHandler(ExamSessions)));
