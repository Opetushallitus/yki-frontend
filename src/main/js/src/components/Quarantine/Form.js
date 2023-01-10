import moment from 'moment';
import React, { useState } from 'react';
import * as R from 'ramda';
import classes from './Quarantine.module.css';
import PropTypes from 'prop-types';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DatePicker from '../../components/UI/DatePicker/DatePicker';
import {
  LANGUAGES,
  DATE_FORMAT,
  DATE_FORMAT_PICKER,
} from '../../common/Constants';

const dateToString = date => date.format('YYYY-MM-DD');
const formatDate = date => moment(date).format(DATE_FORMAT);
const valueOrNull = R.when(R.isEmpty, R.always(null));

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

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().typeError(t('error.string')).required(t('error.mandatory')),
    last_name: Yup.string().typeError(t('error.string')).required(t('error.mandatory')),
    diary_number: Yup.string().typeError(t('error.string')).required(t('error.mandatory')),
  });

  const onFormSubmit = (values) => {
    // Datepicker uses different date format
    const parsedBirthdate = birthdate
          ? dateToString(moment(birthdate, DATE_FORMAT))
          : null;
    const parsedEndDate = endDate
          ? dateToString(moment(endDate, DATE_FORMAT))
          : null;
    const payload = {
      ...values,
      email: valueOrNull(values.email),
      phone_number: valueOrNull(values.phone_number),
      first_name: valueOrNull(values.first_name),
      last_name: valueOrNull(values.last_name),
      diary_number: valueOrNull(values.diary_number),
      birthdate: parsedBirthdate,
      end_date: parsedEndDate,
    };

    values.id
      ? onEdit(payload)
      : onAdd(payload);
  };

  return (
    <Formik
      key={`quarantine-form-${form.id}`}
      initialValues={form}
      validationSchema={validationSchema}
      onSubmit={onFormSubmit}
      render={({ values, handleChange, isValid, dirty }) => (
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
                tabIndex="1">
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
                  noMinDateUpdate: true,
                }}
                autoComplete="off"
                tabIndex="2"
                locale={i18n.language}
                onChange={(dates) => setEndDate(moment(dates[0]).format(DATE_FORMAT))}
                id="end_date"
              />
            </div>

            <div className={classes.QuarantineFormField}>
              <label htmlFor="first_name">{t('common.first_name')}</label>
              <Field autoFocus={true} id="first_name" tabIndex="3" name="first_name" />
              <ErrorMessage
                name="first_name"
                component="span"
                className={classes.ErrorMessage}
              />
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
                  noMinDateUpdate: true,
                }}
                autoComplete="off"
                tabIndex="4"
                locale={i18n.language}
                onChange={(dates) => setBirthdate(moment(dates[0]).format(DATE_FORMAT))}
                id="birthdate"
              />
            </div>

            <div className={classes.QuarantineFormField}>
              <label htmlFor="last_name">{t('common.last_name')}</label>
              <Field id="last_name" tabIndex="5" name="last_name" />
              <ErrorMessage
                name="last_name"
                component="span"
                className={classes.ErrorMessage}
              />
            </div>

            <div className={classes.QuarantineFormField}>
              <label htmlFor="email">{t('common.email')}</label>
              <Field name="email" tabIndex="6" id="email" />
            </div>

            <div className={classes.QuarantineFormField}>
              <label htmlFor="phone_number">{t('common.phoneNumber')}</label>
              <Field name="phone_number" tabIndex="7" id="phone_number" />
            </div>

            <div className={classes.QuarantineFormField}>
              <label htmlFor="diary_number">{t('common.diaryNumber')}</label>
              <Field name="diary_number" tabIndex="8" id="diary_number" />
              <ErrorMessage
                name="diary_number"
                component="span"
                className={classes.ErrorMessage}
              />
            </div>
          </div>

          <div className={classes.ConfirmButtons}>
            <button
              data-cy="submit-quarantine-btn"
              className={classes.ConfirmButton}
              type="submit"
              tabIndex="9"
              disabled={(dirty && !isValid) || (!form.id && !isValid)}>
              {t('common.send')}
            </button>
            <button className={classes.CancelButton} onClick={cancelForm} tabIndex="10">
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
