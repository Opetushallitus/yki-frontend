import moment from 'moment';
import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';

import DatePicker from '../../../components/UI/DatePicker/DatePicker';
import classes from './AddOrEditExamDate.module.css';

const AddEvaluationPeriod = props => {
  const { exam, t, i18n } = props;
  console.log(exam);
  const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));

  return (
    <>
      <h3>{t('examDates.add.evaluation.period')}</h3>
      <div>
        <label>{t('examDates.choose.evaluationTime')}</label>
        <div className={classes.EvaluationDateGrid}>
          <div className={classes.EvaluationDatePickerWrapper}>
            <DatePicker
              data-cy="exam-date-new-registration-start"
              id="registrationStartDate"
              options={{ defaultDate: startDate }}
              onChange={d => {
                setStartDate(moment(d[0]).format('YYYY-MM-DD'));
              }}
              locale={i18n.language}
            />
          </div>

          <div style={{ flex: 0.5, justifyContent: 'center', display: 'flex' }}>
            -
          </div>

          <div className={classes.EvaluationDatePickerWrapper}>
            <DatePicker
              data-cy="exam-date-new-registration-end"
              id="registrationEndDate"
              options={{ defaultDate: endDate }}
              onChange={d => {
                setEndDate(moment(d[0]).format('YYYY-MM-DD'));
              }}
              locale={i18n.language}
            />
          </div>
        </div>
        <button
          className={classes.ConfirmButton}
          onClick={() => console.log('sending request!')}
        >
          {t('examDates.add.evaluation.period')}
        </button>
      </div>
    </>
  );
};

export default withTranslation()(AddEvaluationPeriod);
