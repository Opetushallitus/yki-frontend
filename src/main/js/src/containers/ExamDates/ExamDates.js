import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import moment from 'moment';
import * as R from 'ramda';

import classes from './ExamDates.module.css';
import Page from '../../hoc/Page/Page';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import { DATE_FORMAT, DATE_FORMAT_WITHOUT_YEAR } from '../../common/Constants';
import { languageToString } from '../../util/util';

class ExamDates extends Component {
  componentDidMount = () => {
    this.props.onFetchExamDates();
  };

  render() {
    const examDateRows = examDates => {
      return examDates.map((e, i) => {
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
            <p>{moment(e.exam_date).format(DATE_FORMAT)}</p>
            <p>{languages}</p>
            <p>{level.toLowerCase()}</p>
          </React.Fragment>
        );
      });
    };

    const examDateTables = () => {
      const grouped = R.groupWith(
        (a, b) => a.registration_start_date === b.registration_start_date,
        this.props.examDates,
      );
      return grouped.map((dates, i) => {
        return (
          <React.Fragment key={i}>
            <h3>
              {this.props.t('common.registationPeriod')}{' '}
              {moment(dates[0].registration_start_date).format(
                DATE_FORMAT_WITHOUT_YEAR,
              )}
              &ndash;
              {moment(dates[0].registration_end_date).format(DATE_FORMAT)}
            </h3>
            <div className={classes.Grid} key={i} data-cy="exam-dates-table">
              <h3>{this.props.t('common.examDate')}</h3>
              <h3>{this.props.t('common.language')}</h3>
              <h3>{this.props.t('common.level')}</h3>
              {examDateRows(dates)}
            </div>
            <hr />
          </React.Fragment>
        );
      });
    };

    const content = this.props.loading ? (
      <Spinner />
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
