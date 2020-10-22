import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {withTranslation} from 'react-i18next';
import moment from 'moment';
import * as R from 'ramda';

import Modal from '../../components/UI/Modal/Modal';
import classes from './ExamDates.module.css';
import Page from '../../hoc/Page/Page';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import AddOrEditPostAdmissionConfiguration from './PostAdmission/AddOrEditPostAdmissionConfiguration';
import * as actions from '../../store/actions/index';
import {DATE_FORMAT} from '../../common/Constants';
import {languageToString} from '../../util/util';
import ControlledCheckbox from "../../components/UI/Checkbox/ControlledCheckbox";
import AddExamDateModal from "./AddExamDateModal/AddExamDateModal";
import ExamRegistrationDatesSelector from "./RegistrationDateSelector/ExamRegistrationDateSelector";

class ExamDates extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showAddOrEditPostAdmissionModal: false,
            showAddNewExamDate: false,
            selectedExamDate: null,
            selectedExamDateIndex: null,
            selectedExamDates: [],
            checkboxes: props.examDates.reduce(
                (items, item) => ({
                    ...items,
                    [item.id]: false
                }), {}
            )
        }
    }

    componentDidMount = () => {
        this.props.onFetchExamDates();
    };

    showAddOrEditPostAdmissionModalHandler = examDate =>
        this.setState({showAddOrEditPostAdmissionModal: true, selectedExamDate: examDate});

    closeAddOrEditPostAdmissionModalHandler = () =>
        this.setState({showAddOrEditPostAdmissionModal: false, selectedExamDateIndex: null});

    showAddNewExamDateModalHandler = () =>
        this.setState({showAddNewExamDate: true});

    closeAddNewExamDateModal = () => this.setState({showAddNewExamDate: false});

    selectAllCheckboxes = isSelected => {
        Object.keys(this.state.checkboxes).forEach(checkbox => {
            this.setState(prev => ({
                checkboxes: {
                    ...prev.checkboxes,
                    [checkbox]: isSelected
                }
            }));
        });
    };

    // TODO: new filters & groupings to be added if needed
    grouped = R.groupWith(
        (a, b) => a.registration_start_date === b.registration_start_date,
        this.props.examDates,
    );

    sortedByDateASC = [R.sort(R.ascend(R.prop('exam_date')), this.props.examDates)];
    sortedByDateDESC = [R.sort(R.descend(R.prop('exam_date')), this.props.examDates)];

    firstLanguageElementASC = R.ascend(R.prop(R.pathOr(0, ['languages', 0, 'language_code'])));
    firstLanguageElementDESC = R.descend(R.prop(R.pathOr(0, ['languages', 0, 'language_code'])));

    //TODO: ascend and descend not working
    sortByLanguageASC = R.sort(this.firstLanguageElementASC, this.props.examDates);
    sortByLanguageDESC = R.sort(this.firstLanguageElementDESC, this.props.examDates);

    render() {
        const addOrEditPostAdmissionModal = (
            <>
                {this.state.showAddOrEditPostAdmissionModal ?
                    (
                        <Modal
                            show={this.state.showAddOrEditPostAdmissionModal}
                            modalClosed={this.closeAddOrEditPostAdmissionModalHandler}
                        >
                            <AddOrEditPostAdmissionConfiguration
                                onUpdate={this.closeAddOrEditPostAdmissionModalHandler}
                                loadingExamDates={this.props.loading}
                                examDate={this.props.examDates.find(ed => ed === this.state.selectedExamDate)}
                            />
                        </Modal>
                    ) :
                    null
                }
            </>
        );

        const addNewExamDateModal = (
            <>
                {this.state.showAddNewExamDate ? (
                    <Modal smallModal show={this.state.showAddNewExamDate} modalClosed={this.closeAddNewExamDateModal}>
                        <AddExamDateModal examDates={this.grouped}/>
                    </Modal>
                ) : null}
            </>
        );

        const examDateTables = () => {
            const selectAll = this.props.examDates;
            let result = [];

            selectAll.forEach(item => {
                result.push(item.id);
            });

            const onSelectAllChange = () => {
                const stateArray = this.state.selectedExamDates;

                if (stateArray.length <= 1) {
                    this.setState({
                        selectedExamDates: [...result],
                    });
                    this.selectAllCheckboxes(true);
                } else {
                    this.setState({
                        selectedExamDates: []
                    });
                    this.selectAllCheckboxes(false);
                }
            }

            const examDateButtons = (
                <div className={classes.ActionButtons}>
                    <button
                        className={classes.AdditionButton}
                        onClick={() => this.showAddNewExamDateModalHandler()}
                    >
                        Lisää tutkintopäivä
                    </button>
                    <button
                        className={classes.DeleteButton}
                        onClick={() => console.log('deleted')}
                    >
                        Poista valittuja tutkintopäiviä
                    </button>
                </div>
            );

            const isAllChecked = Object.values(this.state.checkboxes).every(value => value === true);

            const examDateHeaders = (
                <>
                    <div className={classes.Grid} data-cy="exam-dates-table">
                        <ControlledCheckbox
                            onChange={() => onSelectAllChange()}
                            checked={isAllChecked}
                        />
                        <h3>{this.props.t('common.examDate')}</h3>
                        <h3>{this.props.t('common.language')}</h3>
                        <h3>{this.props.t('common.level')}</h3>
                    </div>
                    <hr className={classes.GridDivider}/>
                </>
            );

            const examDateRows = examDates => {

                const handleCheckboxChange = key => {
                    const stateArray = this.state.selectedExamDates;
                    const stateCheckboxes = this.state.checkboxes;
                    const item = examDates[key].id;

                    if (stateArray.length <= 1) {
                        this.setState({
                            selectedExamDates: [...stateArray, item],
                            checkboxes: {
                                ...stateCheckboxes,
                                [item]: !stateCheckboxes[item]
                            }
                        });
                    }
                    if (stateArray.includes(item)) {
                        this.setState({
                            selectedExamDates: stateArray.filter(removable => removable !== item),
                            checkboxes: {
                                ...stateCheckboxes,
                                [item]: !stateCheckboxes[item]
                            }
                        });
                    }
                }

                return examDates.map((e, i) => {
                    const registrationEndDateMoment = moment(e.registration_end_date);

                    const finnishOnly =
                        examDates.length === 1 &&
                        e.languages.length === 1 &&
                        e.languages[0].language_code === 'fin';

                    const level = finnishOnly
                        ? this.props.t('common.level.middle')
                        : this.props.t('common.level.all');

                    const languages = e.languages
                        .map(l => {
                            return languageToString(l.language_code).toLowerCase();
                        })
                        .join(', ');

                    return (
                        <React.Fragment key={i}>
                            <ControlledCheckbox
                                onChange={() => handleCheckboxChange(i)}
                                name={e.id}
                                checked={this.state.checkboxes[e.id]}
                            />
                            <p>{moment(e.exam_date).format(DATE_FORMAT)}</p>
                            {/* eslint-disable-next-line */}
                            {/*
              <p><a href="javascript:void(0)" onClick={ () => this.showAddOrEditPostAdmissionModalHandler(e)}>{e.post_admission_end_date ?
                  `${registrationEndDateMoment.add(1, 'days').format(DATE_FORMAT)} - ${moment(e.post_admission_end_date).format(DATE_FORMAT)}` :
                  this.props.t('examSession.postAdmission.add')}</a></p>
              */}
                            <p>{languages}</p>
                            <p>{level.toLowerCase()}</p>
                        </React.Fragment>
                    );
                });
            };

            const sortedByLanguageASC = [this.sortByLanguageASC];
            const sortedByLanguageDESC = [this.sortByLanguageDESC];

            return (
                <>
                    <ExamRegistrationDatesSelector examDates={this.grouped}/>
                    {examDateButtons}
                    {examDateHeaders}
                    {/* TODO: function to show date rows based on selected filter --> state object */}
                    {this.grouped.map((dates, i) => {
                        return <div className={classes.Grid} key={i}>{examDateRows(dates)}</div>
                    })}
                </>
            )
        };

        const content = this.props.loading ? (
            <Spinner/>
        ) : (
            <div className={classes.ExamSessionList}>
                <h2>{this.props.t('common.examDates')}</h2>
                {this.props.examDates.length > 0 ? (
                    examDateTables()
                ) : (
                    <p>{this.props.t('examDates.noUpcomingExamDates')}</p>
                )}
            </div>
        );

        return (
            <Page>
                <div className={classes.ExamDates}>{content}</div>
                {addOrEditPostAdmissionModal}
                {addNewExamDateModal}
            </Page>
        );
    }
}

const mapStateToProps = state => {
    return {
        examDates: state.dates.examDates,
        loading: state.dates.loading,
        error: state.dates.error,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchExamDates: () => dispatch(actions.fetchExamDates()),
        errorConfirmedHandler: () => dispatch(actions.examDatesFailReset()),
    };
};

ExamDates.propTypes = {
    examDates: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    error: PropTypes.object,
    onFetchExamDates: PropTypes.func.isRequired,
    errorConfirmedHandler: PropTypes.func.isRequired,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withTranslation()(withErrorHandler(ExamDates)));
