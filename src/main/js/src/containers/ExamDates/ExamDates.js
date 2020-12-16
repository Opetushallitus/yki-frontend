import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import moment from 'moment';
import * as R from 'ramda';

import Modal from '../../components/UI/Modal/Modal';
import classes from './ExamDates.module.css';
import Page from '../../hoc/Page/Page';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import * as actions from '../../store/actions/index';
import { DATE_FORMAT } from '../../common/Constants';
import { languageToString, levelDescription } from '../../util/util';
import ControlledCheckbox from '../../components/UI/Checkbox/ControlledCheckbox';
import AddExamDate from './ExamDateModalContent/AddExamDate';
import EditExamDate from './ExamDateModalContent/EditExamDate';

import editIcon from '../../assets/svg/edit.svg';
import RegistrationPeriod from "./util/RegistrationPeriod";
import Checkbox from "../../components/UI/Checkbox/Checkbox";

class ExamDates extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showAddOrEditExamDate: false,
      showDeleteConfirmation: false,
      selectedExamDate: null,
      selectedExamDateIndex: null,
      fetchExamHistory: false,
      grouped: null,
      checkedExamDate: null,
      //selectedExamDates: [], // Use if multiple dates need to be deleted at the same time
    }
  }
  componentDidMount() {
    this.props.user && this.props.user.identity && this.props.onFetchExamDates(this.props.user.identity.oid);
  };


  componentDidUpdate(prevProps, prevState) {
    if (prevState.grouped === null) {
      this.setState({
        grouped: this.sortByRegistrationDate
      });
    }

    if (prevProps.examDates !== this.props.examDates) {
      const result = R.sortBy(R.prop('registration_start_date'), this.props.examDates);
      this.setState({
        grouped: result
      })
    }

    if (prevState.fetchExamHistory !== this.state.fetchExamHistory) {
      const id = this.props.user.identity.oid;
      if (this.state.fetchExamHistory) {
        this.props.onGetExamDatesHistory(id);
      } else {
        this.props.onFetchExamDates(id);
      }
    }
  }

  showAddOrEditExamDateModalHandler = () =>
    this.setState({ showAddOrEditExamDate: !this.state.showAddOrEditExamDate });

  showEditExamDateHandler = selectedDate => {
    this.setState(prev => ({
      showAddOrEditExamDate: !prev.showAddOrEditExamDate,
      selectedExamDate: selectedDate
    }));
  }

  showDeleteConfirmationHandler = () => {
    this.setState({ showDeleteConfirmation: !this.state.showDeleteConfirmation })
  };

  closeDeleteConfirmationHandler = () => this.setState({ showDeleteConfirmation: false });

  closeAddOrEditExamDateModal = () => this.setState({
    showAddOrEditExamDate: false,
    selectedExamDate: null
  });

  onExamDateHistoryFetchChange = () => {
    this.setState(prev => ({
      fetchExamHistory: !prev.fetchExamHistory
    }));
  }

  createExamDateHandler = examDate => {
    this.props.onAddExamDate(
      examDate,
      this.props.user.identity.oid,
    );
    this.closeAddOrEditExamDateModal();
  };

  editExamDateHandler = payload => {
    this.props.onUpdateConfiguration(
      payload.postAdmission,
      payload.languages,
      this.props.user.identity.oid,
      payload.examDateId
    );
    this.closeAddOrEditExamDateModal();
  };

  deleteExamDateHandler = examDate => {
    this.props.onDeleteExamDate(
      this.props.user.identity.oid,
      examDate.id
    );
    this.closeDeleteConfirmationHandler()
  };


  sortByRegistrationDate = R.sortBy(R.prop('registration_start_date'), this.props.examDates);

  grouped = R.groupWith(
    (a, b) => a.registration_start_date === b.registration_start_date,
    this.props.examDates,
  );

  // TODO: new filters & groupings to be added if needed
  // sortedByDateASC = [R.sort(R.ascend(R.prop('exam_date')), this.state.selectedRegistrationPeriod)];
  // sortedByDateDESC = [R.sort(R.descend(R.prop('exam_date')), this.state.selectedRegistrationPeriod)];

  render() {
    const { examDates, loading, t } = this.props;
    const usedDates = examDates.map(ed => ed.exam_date)
    const currentDate = moment(new Date()).format('YYYY-MM-DD');

    const {
      selectedExamDate,
      showAddOrEditExamDate,
    } = this.state;

    const addNewExamDateModal = (
      <>
        {showAddOrEditExamDate ? (
          <Modal smallModal show={showAddOrEditExamDate} modalClosed={this.closeAddOrEditExamDateModal}>
            {!!selectedExamDate ?
              <EditExamDate
                examDate={selectedExamDate}
                onSubmit={this.editExamDateHandler}
              />
              :
              <AddExamDate
                examDates={[]}
                onSubmit={this.createExamDateHandler}
                disabledDates={usedDates}
              />
            }
          </Modal>
        ) : null}
      </>
    );

    const addDeleteConfirmationModal = (
      <>
        {this.state.showDeleteConfirmation ? (
          <Modal confirmationModal show={this.state.showDeleteConfirmation} modalClosed={this.closeDeleteConfirmationHandler}>
            <div className={classes.DeleteModal}>
              <div className={classes.ConfirmText}>Haluatko varmasti poistaa tutkintopäivän?</div>
              <div className={classes.ConfirmButtons}>
                <button
                  className={classes.CancelButton}
                  onClick={this.closeDeleteConfirmationHandler}
                >
                  {t('common.cancelConfirm')}
                </button>
                <button
                  className={classes.ConfirmButton}
                  onClick={() =>
                    this.deleteExamDateHandler(this.state.checkedExamDate)
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



    const examDateTables = () => {

      const onSelectAllChange = () => {
        /*         
        TODO: Decide if the feature should be kept or not.
        Disabled for now to simplify the delete feature.

        if (selectedExamDates.length < 1) {
          this.setState({
            selectedExamDates: [...this.state.grouped],
          });
        } else {
          this.setState({
            selectedExamDates: []
          });
        } */
      }

      const checked = this.state.checkedExamDate;

      // Use this if deleting multiple at the same time should be allowed
      /*  
      const hasExamSessions = exams => {
      if (exams.length > 0) {
          const sessionCount = exams.some(examDate => examDate.exam_session_count);
          return !!(sessionCount && sessionCount > 0);
        } else {
          return !!(exams.exam_session_count && exams.exam_session_count > 0);
        } 
      }*/

      const hasExamSessions = exam => {
        if (!exam || !exam.exam_session_count || exam.exam_session_count === 0) return false;
        if (exam.exam_session_count > 0) return true;
      }

      const examDateButtons = (
        <div className={classes.ExamDateControls}>
          <div className={classes.ActionButtons}>
            <button
              className={classes.AdditionButton}
              onClick={() => this.showAddOrEditExamDateModalHandler()}
            >
              {t('examDates.addNew.confirm')}
            </button>
            <button
              className={!checked || hasExamSessions(checked) ? classes.DisabledButton : classes.DeleteButton}
              disabled={(!checked || hasExamSessions(checked))}
              onClick={this.showDeleteConfirmationHandler}
            >
              {t('examDates.delete.selected')}
            </button>
          </div>
          <div className={classes.PastExamDates}>
            <p>{'Näytä meneet päivät'}</p>
            <Checkbox checked={this.state.fetchExamHistory} onChange={() => this.onExamDateHistoryFetchChange()} />
          </div>
        </div>
      );

      // Hidden until decided if this should exist
      //const isAllChecked = R.equals(this.state.grouped, this.state.selectedExamDates);

      const examDateHeaders = (
        <>
          <div className={classes.Grid} data-cy="exam-dates-table">
            <ControlledCheckbox
              onChange={() => onSelectAllChange()}
              hidden // Hidden until decided if this should exist
            //checked={isAllChecked}
            />
            <h3>{t('common.examDate')}</h3>
            <h3>{`${t('common.language')} & ${t('common.level')}`}</h3>
            <h3>{t('common.registationPeriod')}</h3>
            <h3>{t('common.postAdmission')}</h3>
            <h3>{t('common.edit')}</h3>
          </div>
          <hr className={classes.GridDivider} />
        </>
      );

      const examDateRows = examDates => {

        const handleCheckboxChange = key => {
          // const selectedExamDates = this.state.selectedExamDates;
          const selected = examDates.find(exam => exam.id === key);
          const checked = this.state.checkedExamDate;
          if (!!checked && (selected.id === checked.id)) {
            this.setState({ checkedExamDate: null })
          } else {
            this.setState({ checkedExamDate: selected })
          }

          /* Hidden until decided if this should exist
          
              if (selectedExamDates.length <= examDates.length) {
              this.setState({
                selectedExamDates: [...selectedExamDates, selected],
              });
            }
            if (selectedExamDates.includes(selected)) {
              this.setState(prev => ({
                selectedExamDates: prev.selectedExamDates.filter(removable => removable !== selected),
              }));
            } 
          */
        }

        const cannotDeleteExamDate = exam => {
          return (exam.exam_date < currentDate) || hasExamSessions(exam);
        }

        const canEditExamDate = exam => {
          return (exam.exam_date > currentDate);
        }

        return examDates.map((e, i) => {

          /* TODO: remove this block if new design is implemented
          const finnishOnly =
            examDates.length === 1 &&
            e.languages.length === 1 &&
            e.languages[0].language_code === 'fin';

          const level = finnishOnly
            ? t('common.level.middle')
            : t('common.level.all');

          const languages = e.languages
            .map(l => {
              return languageToString(l.language_code).toLowerCase();
            })
            .join(', ');
          */

          const languageAndLevel = e.languages.map(lang => {
            const language = languageToString(lang.language_code).toLowerCase();
            const level = levelDescription(lang.level_code).toLowerCase();
            return <li key={language + level}>{language}, {level}</li>;
          });

          const isChecked = id => {
            if (!this.state.checkedExamDate) return false
            return id === this.state.checkedExamDate.id
          }

          const postAdmissionDate = `${moment(e.post_admission_start_date).format(DATE_FORMAT)} - 
            ${moment(e.post_admission_end_date).format(DATE_FORMAT)}`;

          return (
            <React.Fragment key={i}>
              <ControlledCheckbox
                onChange={() => handleCheckboxChange(e.id)}
                name={e.id}
                checked={!!isChecked(e.id)}
                disabled={cannotDeleteExamDate(e)}
              />
              <p>{moment(e.exam_date).format(DATE_FORMAT)}</p>
              <ul className={classes.LanguageList}>{languageAndLevel}</ul>
              <RegistrationPeriod period={e} />
              <p>{e.post_admission_enabled ? `${postAdmissionDate}` : 'Kiinni'}</p>
              <button
                disabled={!canEditExamDate(e)}
                className={classes.EditButton}
                onClick={() => this.showEditExamDateHandler(e)}
              >
                {canEditExamDate(e) ? <img src={editIcon} alt={'edit-icon'} /> : null}
              </button>
            </React.Fragment>
          );
        });
      };

      return (
        <>
          {examDateButtons}
          {examDateHeaders}
          {this.state.grouped !== null && (
            <div className={classes.Grid}>
              {examDateRows(this.state.grouped)}
            </div>
          )}
        </>
      )
    };

    const content = loading ? (
      <Spinner />
    ) : (
        <>
          <div className={classes.ExamDatesListHeader}>
            <h2>{t('common.examDates')}</h2>
          </div>
          {examDates.length > 0 ? (
            examDateTables()
          ) : (
              <p>{t('examDates.noUpcomingExamDates')}</p>
            )}
          <hr className={classes.GridDivider} />
        </>
      );
    return (
      <Page>
        <div className={classes.ExamDates}>
          {content}
        </div>
        {addNewExamDateModal}
        {addDeleteConfirmationModal}
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
    onAddExamDate: (examDate, oid) => dispatch(actions.addExamDate(examDate, oid)),
    onFetchExamDates: (oid) => dispatch(actions.fetchExamDates(oid)),
    errorConfirmedHandler: () => dispatch(actions.examDatesFailReset()),
    onGetExamDatesHistory: (oid) => dispatch(actions.GetExamDatesHistory(oid)),
    onUpdateConfiguration: (postAdmission, languages, oid, examDateId) => dispatch(actions.updateExamDateConfigurations(postAdmission, languages, oid, examDateId)),
    onDeleteExamDate: (oid, examDateId) => dispatch(actions.deleteExamDate(oid, examDateId))
  };
};

ExamDates.propTypes = {
  examDates: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  onFetchExamDates: PropTypes.func.isRequired,
  errorConfirmedHandler: PropTypes.func.isRequired,
  onGetExamDatesHistory: PropTypes.func.isRequired,
  onAddExamDate: PropTypes.func.isRequired,
  onUpdateConfiguration: PropTypes.func.isRequired,
  onDeleteExamDate: PropTypes.func.isRequired,
  user: PropTypes.object
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(withErrorHandler(ExamDates)));