import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';

import DatePicker from '../../../components/UI/DatePicker/DatePicker';
import { datePickerValueToDate } from '../../../util/datePicker';

import classes from './ExamDateView.module.css';

const RegistrationPeriod = props => {
  const { t, startDate, endDate, maxStartDate, minEndDate, maxEndDate, setStartDate, setEndDate } = props;

  return (
    <>
      <label>{t('common.registrationPeriod')}</label>
      <div className={classes.DatePeriodGrid}>
        <div className={classes.DatePickerWrapper}>
          <DatePicker
            data-cy="exam-date-new-registration-start"
            id="registrationStartDate"
            options={{
              defaultDate: startDate,
              maxDate: maxStartDate,
            }}
            onChange={d => setStartDate(datePickerValueToDate(d))}
            locale={props.i18n.language}
          />
        </div>
        &nbsp; &ndash; &nbsp;
        <div className={classes.DatePickerWrapper}>
          <DatePicker
            data-cy="exam-date-new-registration-end"
            id="registrationEndDate"
            options={{
              defaultDate: endDate,
              minDate: minEndDate,
              maxDate: maxEndDate,
            }}
            onChange={d => setEndDate(datePickerValueToDate(d))}
            locale={props.i18n.language}
          />
        </div>
      </div>
    </>
  );
};

RegistrationPeriod.propTypes = {
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  maxStartDate: PropTypes.string,
  minEndDate: PropTypes.string,
  maxEndDate: PropTypes.string,
  setStartDate: PropTypes.func.isRequired,
  setEndDate: PropTypes.func.isRequired,
};

export default withTranslation()(RegistrationPeriod);
