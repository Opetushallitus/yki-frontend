import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';

import DatePicker from '../../../components/UI/DatePicker/DatePicker';
import ToggleSwitch from "../../../components/UI/ToggleSwitch/ToggleSwitch";
import { datePickerValueToDate } from '../../../util/datePicker';

import classes from './ExamDateView.module.css';

const PostAdmission = props => {
  const {
    t,
    isEnabled,
    setIsEnabled,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    minStartDate,
    maxStartDate,
    minEndDate,
    maxEndDate,
  } = props;

  return (
    <div className={classes.PostAdmission}>
      <label>{t('examDates.edit.postAdmission.title')}</label>
      <div className={classes.PostAdmissionContainer}>
        <div className={classes.Toggle}>
          <ToggleSwitch
            dataCy="exam-dates-modify-post-admission-toggle"
            checked={isEnabled}
            onChange={() =>
              setIsEnabled(!isEnabled)
            }
          />
          <p className={classes.Label}>
            {t('examDates.edit.postAdmission.allow')}
          </p>
        </div>
        <p className={classes.Label}>
          {t('examDates.edit.postAdmission.dates')}
        </p>
        <div className={classes.DatePeriodGrid}>
          <div className={`${classes.DatePickerWrapper} ${!isEnabled && classes.Disabled}`}>
            <DatePicker
              id="postAdmissionStartDate"
              data-cy="exam-dates-modify-post-admission-start-date"
              disabled={!isEnabled}
              options={{
                defaultDate: startDate,
                minDate: minStartDate,
                maxDate: maxStartDate,
              }}
              locale={props.i18n.language}
              onChange={d => setStartDate(datePickerValueToDate(d))}
            />
          </div>
          &nbsp; &ndash; &nbsp;
          <div className={`${classes.DatePickerWrapper} ${!isEnabled && classes.Disabled}`}>
            <DatePicker
              id="postAdmissionEndDate"
              data-cy="exam-dates-modify-post-admission-end-date"
              disabled={!isEnabled}
              options={{
                defaultDate: endDate,
                minDate: minEndDate,
                maxDate: maxEndDate,
              }}
              onChange={d => setEndDate(datePickerValueToDate(d))}
              locale={props.i18n.language}
              tabIndex="1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

PostAdmission.propTypes = {
  isEnabled: PropTypes.bool,
  setIsEnabled: PropTypes.func.isRequired,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  setStartDate: PropTypes.func.isRequired,
  setEndDate: PropTypes.func.isRequired,
  minStartDate: PropTypes.string,
  maxStartDate: PropTypes.string,
  minEndDate: PropTypes.string,
  maxEndDate: PropTypes.string,
};

export default withTranslation()(PostAdmission);
