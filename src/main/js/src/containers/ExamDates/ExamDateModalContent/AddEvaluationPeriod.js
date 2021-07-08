import { Form, Formik } from 'formik';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';

import DatePicker from '../../../components/UI/DatePicker/DatePicker';
import { compareDates } from '../../../util/util';
import classes from './AddOrEditExamDate.module.css';

const AddEvaluationPeriod = props => {
  const { exam, t, i18n, onSubmit } = props;
  const [evaluationStartDate, setEvaluationStartDate] = useState(
    moment(exam.exam_date).format('YYYY-MM-DD'),
  );
  const [evaluationEndDate, setEvaluationEndDate] = useState(
    moment(exam.exam_date).format('YYYY-MM-DD'),
  );

  useEffect(() => {
    const endDateOk = compareDates(evaluationStartDate, evaluationEndDate);
    if (!endDateOk) setEvaluationEndDate(evaluationStartDate);
  }, [evaluationStartDate]);

  return (
    <Formik
      initialValues={{
        evaluationStartDate,
        evaluationEndDate,
      }}
      onSubmit={values => {
        const payload = {
          id: exam.id,
          evaluation_start_date: evaluationStartDate,
          evaluation_end_date: evaluationEndDate,
        };

        onSubmit(payload);
      }}
      render={() => (
        <Form>
          <h3 className={classes.ModalTitle}>
            {t('examDates.add.evaluation.period')}
          </h3>
          <div>
            <label>{t('examDates.choose.evaluationTime')}</label>
            <div className={classes.EvaluationDateGrid}>
              <div
                className={classes.EvaluationDatePickerWrapper}
                data-cy="exam-date-new-registration-start"
              >
                <DatePicker
                  id="evaluationStartDate"
                  options={{
                    defaultDate: evaluationStartDate,
                    value: evaluationStartDate,
                    minDate: moment(exam.exam_date).format('YYYY-MM-DD'),
                  }}
                  onChange={d => {
                    setEvaluationStartDate(moment(d[0]).format('YYYY-MM-DD'));
                  }}
                  locale={i18n.language}
                />
              </div>

              <div
                style={{ flex: 0.5, justifyContent: 'center', display: 'flex' }}
              >
                -
              </div>

              <div
                className={classes.EvaluationDatePickerWrapper}
                data-cy="exam-date-new-registration-end"
              >
                <DatePicker
                  id="evaluationEndDate"
                  options={{
                    defaultDate: evaluationEndDate,
                    value: evaluationEndDate,
                    minDate: evaluationStartDate,
                  }}
                  onChange={d => {
                    setEvaluationEndDate(moment(d[0]).format('YYYY-MM-DD'));
                  }}
                  locale={i18n.language}
                />
              </div>
            </div>
            <div className={classes.ActionButtons} style={{ bottom: '2rem' }}>
              <button className={classes.ConfirmButton}>
                {t('examDates.add.evaluation.period')}
              </button>
            </div>
          </div>
        </Form>
      )}
    ></Formik>
  );
};

export default withTranslation()(AddEvaluationPeriod);
