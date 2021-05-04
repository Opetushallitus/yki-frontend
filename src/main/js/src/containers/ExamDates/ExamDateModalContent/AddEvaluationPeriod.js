import { Form, Formik } from 'formik';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';

import DatePicker from '../../../components/UI/DatePicker/DatePicker';
import { compareDates } from '../../../util/util';
import classes from './AddOrEditExamDate.module.css';

const AddEvaluationPeriod = props => {
  const { exam, t, i18n, oid } = props;
  console.log(exam);
  const [evaluationStartDate, setEvaluationStartDate] = useState(
    moment().format('YYYY-MM-DD'),
  );
  const [evaluationEndDate, setEvaluationEndDate] = useState(
    moment().format('YYYY-MM-DD'),
  );

  useEffect(() => {
    const endDateOk = compareDates(evaluationStartDate, evaluationEndDate);
    if (!endDateOk) setEvaluationEndDate(evaluationStartDate);
  }, [evaluationStartDate]);

  console.log(evaluationEndDate);

  return (
    <Formik
      initialValues={{
        evaluationStartDate,
        evaluationEndDate,
      }}
      onSubmit={values => {
        const payload = {
          id: exam.id,
          oid: oid,
          evaluation_start_date: evaluationStartDate,
          evaluaton_end_date: evaluationEndDate,
        };

        console.log('submit');
      }}
      render={() => (
        <Form>
          <h3 className={classes.ModalTitle}>
            {t('examDates.add.evaluation.period')}
          </h3>
          <div>
            <label>{t('examDates.choose.evaluationTime')}</label>
            <div className={classes.EvaluationDateGrid}>
              <div className={classes.EvaluationDatePickerWrapper}>
                <DatePicker
                  data-cy="exam-date-new-registration-start"
                  id="evaluationStartDate"
                  options={{ defaultDate: evaluationStartDate }}
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

              <div className={classes.EvaluationDatePickerWrapper}>
                <DatePicker
                  data-cy="exam-date-new-registration-end"
                  id="evaluationEndDate"
                  options={{
                    defaultDate: evaluationEndDate,
                    minDate: evaluationStartDate,
                  }}
                  onChange={d => {
                    setEvaluationEndDate(moment(d[0]).format('YYYY-MM-DD'));
                  }}
                  locale={i18n.language}
                />
              </div>
            </div>
            <div
              className={classes.ActionButtons}
              style={{ position: 'absolute', bottom: '2rem' }}
            >
              <button
                className={classes.ConfirmButton}
                onClick={() => console.log('sending request!')}
              >
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
