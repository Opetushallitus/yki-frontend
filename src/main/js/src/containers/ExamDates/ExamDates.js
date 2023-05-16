import moment from 'moment';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { DATE_FORMAT } from '../../common/Constants';
import Checkbox from '../../components/UI/Checkbox/Checkbox';
import Modal from '../../components/UI/Modal/Modal';
import Spinner from '../../components/UI/Spinner/Spinner';
import Page from '../../hoc/Page/Page';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import { languageToString, levelDescription } from '../../util/util';
import AddEvaluationPeriod from './ExamDateModal/AddEvaluationPeriod';
import ExamDateView from './ExamDateModal/ExamDateView';
import ExamDatesRegistrationPeriod from './ExamDatesRegistrationPeriod';

import classes from './ExamDates.module.css';

class ExamDates extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showExamDateModal: false,
      showAddEvaluationPeriodModal: false,
      showPassedExamDates: false,
      selectedExamDate: null,
      visibleExamDates: null,
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
        R.prop('exam_date'),
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

  togglePassedExamDatesShown = () => {
    this.setState(prev => ({
      showPassedExamDates: !prev.showPassedExamDates,
    }));
  };

  unsetPassedExamDatesShown = () => {
    this.setState({ showPassedExamDates: false });
  };

  handleCreateExamDate = payload => {
    this.props.onAddExamDate(payload, this.props.user.identity.oid);
    this.unsetPassedExamDatesShown();
    this.closeExamDateModal();
  };

  handleEditExamDate = payload => {
    const { examDateId, ...rest } = payload;

    this.props.onUpdateExamDate(examDateId, rest, this.props.user.identity.oid);
    this.unsetPassedExamDatesShown();
    this.closeExamDateModal();
  };

  handleDeleteExamDate = examDateId => {
    this.props.onDeleteExamDate(examDateId, this.props.user.identity.oid);
    this.unsetPassedExamDatesShown();
    this.closeExamDateModal();
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

    const {
      showExamDateModal,
      showAddEvaluationPeriodModal,
      selectedExamDate,
    } = this.state;

    const addEvaluationPeriodModal = (
      <>
        {showAddEvaluationPeriodModal ? (
          <Modal
            show
            style={{ height: '200px', maxWidth: '500px' }}
            modalClosed={this.closeAddEvaluationPeriodModal}
          >
            <AddEvaluationPeriod
              exam={selectedExamDate}
              onSubmit={this.handleAddEvaluationPeriod}
            />
          </Modal>
        ) : null}
      </>
    );

    const renderExamDateModal = () => {
      const onSave = selectedExamDate
        ? this.handleEditExamDate
        : this.handleCreateExamDate;

      // Passed exam dates are disabled only if they are shown
      const disabledDates = examDates
        .filter((ed) => !selectedExamDate || ed.exam_date !== selectedExamDate.exam_date)
        .map((ed) => ed.exam_date);

      return (
        <Modal
          show
          style={{ height: '650px', maxWidth: '800px' }}
          modalClosed={this.closeExamDateModal}
        >
          <ExamDateView
            examDate={selectedExamDate}
            onSave={onSave}
            onDelete={this.handleDeleteExamDate}
            disabledDates={disabledDates}
          />
        </Modal>
      );
    };

    const examDateControls = (
      <div className={classes.ExamDateControls}>
        <div className={classes.ActionButtons}>
          <button
            data-cy="exam-dates-button-add-new"
            className={classes.AdditionButton}
            onClick={() => this.showExamDateModal(null)}
          >
            {t('examDates.addNew.confirm')}
          </button>
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

    const examDateTable = () => {
      const tableHeader = (
        <>
          <div className={classes.Grid} data-cy="exam-dates-table-headers">
            <h3>{t('common.examDate')}</h3>
            <h3>{t('examDates.languageLevels')}</h3>
            <h3>{t('common.registrationPeriod')}</h3>
            <h3>{t('common.postAdmission')}</h3>
            <h3>{t('common.reeval')}</h3>
            <h3>{t('common.edit')}</h3>
          </div>
          <hr className={classes.GridDivider} />
        </>
      );

      const tableRows = examDates => {
        return examDates.map((e, i) => {
          const languageLevel =
            e.languages &&
            e.languages.map(lang => {
              const key = `${lang.language_code}-${lang.level_code}`;
              const content = `${languageToString(lang.language_code)}, ${levelDescription(lang.level_code)}`.toLowerCase();

              return (
                <li
                  data-cy={`exam-dates-row-language-${e.exam_date}-${key}`}
                  key={key}
                >
                  {content}
                </li>
              );
            });

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
              <p data-cy={`exam-dates-list-date-${e.exam_date}`}>
                {moment(e.exam_date).format(DATE_FORMAT)}
              </p>
              <ul
                data-cy={`exam-dates-list-languages-${e.exam_date}`}
                className={classes.LanguageList}
              >
                {languageLevel}
              </ul>
              <ExamDatesRegistrationPeriod period={e} />
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
                  className={`${classes.EditButton} ${classes.Evaluation}`}
                  onClick={() => this.showAddEvaluationPeriodModal(e)}
                >
                  {t('examDates.add.evaluation.period')}
                </button>
              )}

              <button
                data-cy={`exam-dates-edit-button-${e.exam_date}`}
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
          {tableHeader}
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
          <h1>{t('common.examDates')}</h1>
        </div>
        {examDates.length > 0 ? (
          <div>
            {examDateControls}
            {examDateTable()}

            <hr className={classes.GridDivider} />
          </div>
        ) :
          <div>
            <p>{t('examDates.noUpcomingExamDates')}</p>
            {examDateControls}
          </div>
        }
      </>
    );

    return (
      <Page>
        <div className={classes.ExamDates}>{content}</div>
        {showExamDateModal && renderExamDateModal()}
        {addEvaluationPeriodModal}
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
    onAddExamDate: (payload, oid) =>
      dispatch(actions.addExamDate(payload, oid)),
    onFetchExamDates: (oid, fetchHistory) =>
      dispatch(actions.fetchExamDates(oid, fetchHistory)),
    errorConfirmedHandler: () => dispatch(actions.examDatesFailReset()),
    onUpdateExamDate: (examDateId, payload, oid) =>
      dispatch(actions.updateExamDate(examDateId, payload, oid)),
    onDeleteExamDate: (examDateId, oid) =>
      dispatch(actions.deleteExamDate(examDateId, oid)),
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
  onUpdateExamDate: PropTypes.func.isRequired,
  onDeleteExamDate: PropTypes.func.isRequired,
  onAddEvaluationPeriod: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(withErrorHandler(ExamDates)));
