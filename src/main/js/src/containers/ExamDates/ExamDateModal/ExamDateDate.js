import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';

import DatePicker from '../../../components/UI/DatePicker/DatePicker';
import { datePickerValueToDate } from '../../../util/datePicker';

import classes from './ExamDateView.module.css';

const ExamDateDate = props => {
  const { t, isEnabled, date, minDate, setDate, disabledDates } = props;

  return (
    <>
      <label>{t('common.examDate')}</label>
      <div className={classes.ExamDateGrid}>
        <div className={`${classes.DatePickerWrapper} ${!isEnabled && classes.Disabled}`}>
          <DatePicker
            id="exam_date"
            data-cy="exam-date-new-exam-date"
            disabled={!isEnabled}
            options={{
              defaultDate: date,
              minDate,
              disable: disabledDates,
            }}
            onChange={d => setDate(datePickerValueToDate(d))}
            locale={props.i18n.language}
          />
        </div>
      </div>
    </>
  );
};

ExamDateDate.propTypes = {
  isEnabled: PropTypes.bool.isRequired,
  date: PropTypes.string,
  minDate: PropTypes.string,
  setDate: PropTypes.func,
  disabledDates: PropTypes.arrayOf(PropTypes.string),
};

export default withTranslation()(ExamDateDate);
