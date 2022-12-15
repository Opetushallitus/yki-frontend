import moment from 'moment';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { DATE_FORMAT } from '../../common/Constants';
import Checkbox from '../../components/UI/Checkbox/Checkbox';
import ControlledCheckbox from '../../components/UI/Checkbox/ControlledCheckbox';
import Modal from '../../components/UI/Modal/Modal';
import Spinner from '../../components/UI/Spinner/Spinner';
import Page from '../../hoc/Page/Page';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import { languageToString, levelDescription } from '../../util/util';
import AddEvaluationPeriod from './ExamDateModalContent/AddEvaluationPeriod';
import AddExamDate from './ExamDateModalContent/AddExamDate';
import EditExamDate from './ExamDateModalContent/EditExamDate';
import classes from './ExamDates.module.css';
import RegistrationPeriod from './util/RegistrationPeriod';

class ExamDates extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showExamDateModal: false,
      showAddEvaluationPeriodModal: false,
      showDeleteConfirmationModal: false,
      showPassedExamDates: false,
      selectedExamDate: null,
      visibleExamDates: null,
      checkedExamDate: null,
    };
  }

  componentDidMount() {
    this.props.user &&
      this.props.user.identity &&
      this.props.onFetchExamDates(this.props.user.identity.oid);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.visibleExamDates || prevProps.examDates !== this.props.examDates) {
      const examDates = R.sortBy(
        R.prop('registration_start_date'),
        this.props.examDates
      ).reverse();

      this.setState({ visibleExamDates: examDates });
    }

    if (prevState.showPassedExamDates !== this.state.showPassedExamDates) {
      this.props.onFetchExamDates(this.props.user.identity.oid, this.state.showPassedExamDates);
    }
  }

  showExamDateModal = selectedExamDate => {
    this.setState({
      selectedExamDate,
      showExamDateModal: true,
    });
  };

  closeExamDateModal = () => {
    this.setState({
      selectedExamDate: null,
      showExamDateModal: false,
    });
  };

  showAddEvaluationPeriodModal = selectedExamDate => {
    this.setState({
      selectedExamDate,
      showAddEvaluationPeriodModal: true,
    });
  };

  closeAddEvaluationPeriodModal = () => {
    this.setState({
      selectedExamDate: null,
      showAddEvaluationPeriodModal: false,
    });
  };

  toggleShowDeleteConfirmationModal = () => {
    this.setState(prev => ({
      showDeleteConfirmationModal: !prev.showDeleteConfirmationModal,
    }));
  };

  togglePassedExamDatesShown = () => {
    this.setState(prev => ({
      showPassedExamDates: !prev.showPassedExamDates,
    }));
  };

  unsetPassedExamDatesShown = () => {
    this.setState({ showPassedExamDates: false });
  };

  handleCreateExamDate = examDate => {
    this.props.onAddExamDate(examDate, this.props.user.identity.oid);
    this.unsetPassedExamDatesShown();
    this.closeExamDateModal();
  };

  handleEditExamDate = payload => {
    this.props.onUpdateConfiguration(
      payload.postAdmission,
      payload.languages,
      this.props.user.identity.oid,
      payload.examDateId,
    );
    this.unsetPassedExamDatesShown();
    this.closeExamDateModal();
  };

  handleDeleteExamDate = examDate => {
    this.props.onDeleteExamDate(this.props.user.identity.oid, examDate.id);
    this.unsetPassedExamDatesShown();
    this.toggleShowDeleteConfirmationModal();
  };

  handleAddEvaluationPeriod = payload => {
    this.props.onAddEvaluationPeriod({
      ...payload,
      oid: this.props.user.identity.oid,
    });
    this.unsetPassedExamDatesShown();
    this.closeAddEvaluationPeriodModal();
  };

  render() {
    const { examDates, loading, t } = this.props;
    const currentDate = moment(new Date()).format('YYYY-MM-DD');
    const upcomingExamDatesExist = examDates.length > 0;

    const {
      showExamDateModal,
      showAddEvaluationPeriodModal,
      selectedExamDate,
    } = this.state;

    const addEvaluationPeriodModal = (
      <>
        {showAddEvaluationPeriodModal ? (
          <Modal
            show={showAddEvaluationPeriodModal}
            modalClosed={this.closeAddEvaluationPeriodModal}
            smallModal
          >
            <AddEvaluationPeriod
              exam={selectedExamDate}
              onSubmit={this.handleAddEvaluationPeriod}
            />
          </Modal>
        ) : null}
      </>
    );

    const examDateModal = (
      <>
        {showExamDateModal ? (
          <Modal
            smallModal
            show={showExamDateModal}
            modalClosed={this.closeExamDateModal}
          >
            {selectedExamDate ? (
              <EditExamDate
                examDate={selectedExamDate}
                onSubmit={this.handleEditExamDate}
              />
            ) : (
              <AddExamDate
                examDates={[]}
                onSubmit={this.handleCreateExamDate}
                disabledDates={examDates.map(ed => ed.exam_date)}
              />
            )}
          </Modal>
        ) : null}
      </>
    );

    const deleteExamDateConfirmationModal = (
      <>
        {this.state.showDeleteConfirmationModal ? (
          <Modal
            confirmationModal
            show={this.state.showDeleteConfirmationModal}
            modalClosed={this.toggleShowDeleteConfirmationModal}
          >
            <div className={classes.DeleteModal}>
              <div className={classes.ConfirmText}>
                {t('examDates.delete.confirm')}
              </div>
              <div className={classes.ConfirmButtons}>
                <button
                  data-cy="exam-dates-delete-cancel"
                  className={classes.CancelButton}
                  onClick={this.toggleShowDeleteConfirmationModal}
                >
                  {t('common.cancelConfirm')}
                </button>
                <button
                  data-cy="exam-dates-delete-confirm"
                  className={classes.ConfirmButton}
                  onClick={() =>
                    this.handleDeleteExamDate(this.state.checkedExamDate)
                  }
                >
                  {t('common.confirm')}
                </button>
              </div>
            </div>
          </Modal>
        ) : null}
      </>
    );

    const hasExamSessions = exam => {
      if (exam && exam.exam_session_count) {
        return exam.exam_session_count > 0;
      }
      return false;
    }

    const examDatesControlButtons = () => {
      const checked = this.state.checkedExamDate;

      return (
        <div className={classes.ExamDateControls}>
          <div className={classes.ActionButtons}>
            <button
              data-cy="exam-dates-button-add-new"
              className={classes.AdditionButton}
              onClick={() => this.showExamDateModal(null)}
            >
              {t('examDates.addNew.confirm')}
            </button>
            {upcomingExamDatesExist && (
              <button
                data-cy="exam-dates-button-delete"
                className={
                  !checked || hasExamSessions(checked)
                    ? classes.DisabledButton
                    : classes.DeleteButton
                }
                disabled={!checked || hasExamSessions(checked)}
                onClick={this.toggleShowDeleteConfirmationModal}
              >
                {t('examDates.delete.selected')}
              </button>
            )}
          </div>
          <div className={classes.PastExamDates}>
            <Checkbox
              label={t('examDates.show.pastDates')}
              name={'showPastDates'}
              checkboxId={'showPastDates'}
              checked={this.state.showPassedExamDates}
              onChange={() => this.togglePassedExamDatesShown()}
            />
          </div>
        </div>
      );
    }

    const examDatesTable = () => {

      const tableHeaders = (
        <>
          <div className={classes.Grid} data-cy="exam-dates-table-headers">
            <span />
            <h3>{t('common.examDate')}</h3>
            <h3>{`${t('common.language')} & ${t('common.level')}`}</h3>
            <h3>{t('common.registationPeriod')}</h3>
            <h3>{t('common.postAdmission')}</h3>
            <h3>{t('common.reeval')}</h3>
            <h3>{t('common.edit')}</h3>
          </div>
          <hr className={classes.GridDivider} />
        </>
      );

      const tableRows = examDates => {

        const handleCheckboxChange = examId => {
          const selected = examDates.find(exam => exam.id === examId);
          const checked = this.state.checkedExamDate;

          if (checked && selected.id === checked.id) {
            this.setState({ checkedExamDate: null });
          } else {
            this.setState({ checkedExamDate: selected });
          }
        };

        const cannotDeleteExamDate = exam => {
          return exam.exam_date < currentDate || hasExamSessions(exam);
        };

        const canEditExamDate = exam => {
          return exam.exam_date > currentDate;
        };

        return examDates.map((e, i) => {
          const languageAndLevel =
            e.languages &&
            e.languages.map(lang => {
              const language = languageToString(lang.language_code).toLowerCase();
              const level = levelDescription(lang.level_code).toLowerCase();
              const dataId = e.exam_date + '-' + lang.language_code + '-' + lang.level_code;

              return (
                <li
                  data-cy={`exam-dates-row-language-${dataId}`}
                  key={language + level}
                >
                  {language}, {level}
                </li>
              );
            });

          const isChecked = id => {
            return this.state.checkedExamDate && this.state.checkedExamDate.id === id;
          };

          const postAdmissionDate =
            e.post_admission_start_date && e.post_admission_end_date
              ? `${moment(e.post_admission_start_date).format(
                  DATE_FORMAT,
                )} - ${moment(e.post_admission_end_date).format(DATE_FORMAT)}`
              : '';

          const reEvaluationDate =
            e.evaluation_start_date &&
            e.evaluation_end_date &&
            `${moment(e.evaluation_start_date).format(DATE_FORMAT)} - ${moment(
              e.evaluation_end_date,
            ).format(DATE_FORMAT)}`;

          return (
            <React.Fragment key={i}>
              <ControlledCheckbox
                dataCy={`exam-dates-list-checkbox-${e.exam_date}`}
                onChange={() => handleCheckboxChange(e.id)}
                name={e.id}
                checked={isChecked(e.id)}
                disabled={cannotDeleteExamDate(e)}
              />
              <p data-cy={`exam-dates-list-date-${e.exam_date}`}>
                {moment(e.exam_date).format(DATE_FORMAT)}
              </p>
              <ul
                data-cy={`exam-dates-list-languages-${e.exam_date}`}
                className={classes.LanguageList}
              >
                {languageAndLevel}
              </ul>
              <RegistrationPeriod period={e} />
              <p data-cy={`exam-dates-list-post-admission-${e.exam_date}`}>
                {postAdmissionDate
                  ? `${postAdmissionDate}`
                  : t('examDates.postAdmission.closed')}
              </p>

              {reEvaluationDate ? (
                <p data-cy={`exam-dates-add-eval-text-${e.exam_date}`}>
                  {reEvaluationDate}
                </p>
              ) : (
                <button
                  data-cy={`exam-dates-add-eval-button-${e.exam_date}`}
                  className={classes.EditButton}
                  style={{ width: '90%' }}
                  onClick={() => this.showAddEvaluationPeriodModal(e)}
                >
                  {t('examDates.add.evaluation.period')}
                </button>
              )}

              <button
                data-cy={`exam-dates-edit-button-${e.exam_date}`}
                disabled={!canEditExamDate(e)}
                className={classes.EditButton}
                onClick={() => this.showExamDateModal(e)}
              >
                {t('common.edit')}
              </button>
            </React.Fragment>
          );
        });
      };

      return (
        <>
          {tableHeaders}
          {this.state.visibleExamDates && (
            <div className={classes.Grid} data-cy="exam-dates-table-rows">
              {tableRows(this.state.visibleExamDates)}
            </div>
          )}
        </>
      );
    };

    const content = loading ? (
      <Spinner />
    ) : (
      <>
        <div className={classes.ExamDatesListHeader}>
          <h2>{t('common.examDates')}</h2>
        </div>
        {upcomingExamDatesExist ? (
          <div>
            {examDatesControlButtons()}
            {examDatesTable()}

            <hr className={classes.GridDivider} />
          </div>
        ) :
          <div>
            <p>{t('examDates.noUpcomingExamDates')}</p>
            {examDatesControlButtons()}
          </div>
        }
      </>
    );

    return (
      <Page>
        <div className={classes.ExamDates}>{content}</div>
        {examDateModal}
        {addEvaluationPeriodModal}
        {deleteExamDateConfirmationModal}
      </Page>
    );
  }
}

const mapStateToProps = state => {
  return {
    examDates: state.dates.examDates,
    loading: state.dates.loading,
    error: state.dates.error,
    user: state.user.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAddExamDate: (examDate, oid) =>
      dispatch(actions.addExamDate(examDate, oid)),
    onFetchExamDates: (oid, fetchHistory) =>
      dispatch(actions.fetchExamDates(oid, fetchHistory)),
    errorConfirmedHandler: () => dispatch(actions.examDatesFailReset()),
    onUpdateConfiguration: (postAdmission, languages, oid, examDateId) =>
      dispatch(
        actions.updateExamDateConfigurations(
          postAdmission,
          languages,
          oid,
          examDateId,
        ),
      ),
    onDeleteExamDate: (oid, examDateId) =>
      dispatch(actions.deleteExamDate(oid, examDateId)),
    onAddEvaluationPeriod: payload =>
      dispatch(actions.addEvaluationPeriod(payload)),
  };
};

ExamDates.propTypes = {
  examDates: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  user: PropTypes.object,
  onAddExamDate: PropTypes.func.isRequired,
  onFetchExamDates: PropTypes.func.isRequired,
  errorConfirmedHandler: PropTypes.func.isRequired,
  onUpdateConfiguration: PropTypes.func.isRequired,
  onDeleteExamDate: PropTypes.func.isRequired,
  onAddEvaluationPeriod: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(withErrorHandler(ExamDates)));
