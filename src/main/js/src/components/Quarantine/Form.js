import moment from 'moment';
import React, { useState } from 'react';
import classes from './Quarantine.module.css';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import DatePicker from '../../components/UI/DatePicker/DatePicker';
import {
  LANGUAGES,
  DATE_FORMAT,
  DATE_FORMAT_PICKER,
} from '../../common/Constants';

const dateToString = date => date.format('YYYY-MM-DD');
const formatDate = date => moment(date).format(DATE_FORMAT);

const QuarantineForm = props => {
  const {
    t,
    i18n,
    form,
    onEdit,
    onAdd,
    onCancel,
  } = props;
  const initialEndDate = form.end_date
        ? formatDate(form.end_date)
        : null;
  const initialBirthdate = form.birthdate
        ? formatDate(form.birthdate)
        : null;

  // Datepicker doesn't work with formik so we store it in state instead
  const [endDate, setEndDate] = useState(initialEndDate);
  const [birthdate, setBirthdate] = useState(initialBirthdate);
  const today = moment(new Date()).format('YYYY-MM-DD');
  const cancelForm = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onCancel();
  };

  const onFormSubmit = (values) => {
    // Datepicker can return either Date object or string
    const parsedBirthdate = (birthdate instanceof Date)
      ? moment(birthdate)
      : moment(birthdate, DATE_FORMAT)
    const parsedEndDate = (endDate instanceof Date)
      ? moment(endDate)
      : moment(endDate, DATE_FORMAT)
    const payload = {
      ...values,
      birthdate: dateToString(parsedBirthdate),
      end_date: dateToString(parsedEndDate),
    };

    values.id
      ? onEdit(payload)
      : onAdd(payload);
  };

  return (
    <Formik
      initialValues={form}
      onSubmit={onFormSubmit}
      render={({ values, handleChange }) => (
        <Form>
          <div className={classes.QuarantineFormFields}>
            <div className={classes.QuarantineFormField}>
              <label htmlFor="language_code">
                {t('common.examLanguage')}
              </label>
              <select
                value={values.language_code}
                name="language_code"
                onChange={handleChange}
                id="language_code"
              >
                {LANGUAGES.map((lang) => (
                  <option key={`lang-option-${lang.code}`} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={classes.QuarantineFormField}>
              <label htmlFor="end_date">{t('common.expires')}</label>
              <DatePicker
                options={{
                  defaultDate: endDate,
                  value: endDate,
                  minDate: today,
                  allowInput: true,
                  dateFormat: DATE_FORMAT_PICKER,
                }}
                locale={i18n.language}
                onChange={(dates) => setEndDate(dates[0])}
                id="end_date"
              />
            </div>

            <div className={classes.QuarantineFormField}>
              <label htmlFor="first_name">{t('common.first_name')}</label>
              <Field id="first_name" name="first_name" />
            </div>

            <div className={classes.QuarantineFormField}>
              <label htmlFor="birthdate">{t('common.birthdate')}</label>
              <DatePicker
                options={{
                  defaultDate: birthdate,
                  value: birthdate,
                  maxDate: today,
                  allowInput: true,
                  dateFormat: DATE_FORMAT_PICKER,
                }}
                locale={i18n.language}
                onChange={(dates) => setBirthdate(dates[0])}
                id="birthdate"
              />
            </div>

            <div className={classes.QuarantineFormField}>
              <label htmlFor="last_name">{t('common.last_name')}</label>
              <Field id="last_name" name="last_name" />
            </div>

            <div className={classes.QuarantineFormField}>
              <label htmlFor="email">{t('common.email')}</label>
              <Field name="email" id="email" />
            </div>

            <div className={classes.QuarantineFormField}>
              <label htmlFor="phone_number">{t('common.phoneNumber')}</label>
              <Field name="phone_number" id="phone_number" />
            </div>
          </div>

          <div className={classes.ConfirmButtons}>
            <button className={classes.ConfirmButton} type="submit" tabIndex="4">
              {t('common.send')}
            </button>
            <button className={classes.CancelButton} onClick={cancelForm} tabIndex="4">
              {t('common.cancelConfirm')}
            </button>
          </div>
        </Form>
      )}/>
  );
};

QuarantineForm.propTypes = {
  t: PropTypes.func.isRequired,
  i18n: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default QuarantineForm;
