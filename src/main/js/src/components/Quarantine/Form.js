import moment from 'moment';
import React, { useState } from 'react';
import classes from './Quarantine.module.css';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import DatePicker from '../../components/UI/DatePicker/DatePicker';
import { LANGUAGES } from '../../common/Constants';

const dateToString = date => date.format('YYYY-MM-DD');

const QuarantineForm = props => {
  const {
    t,
    i18n,
    form,
    emptyForm,
    onEdit,
    onAdd,
    onCancel,
  } = props;
  const [endDate, setEndDate] = useState(null);
  const [birthdate, setBirthdate] = useState(null);
  const today = moment(new Date()).format('YYYY-MM-DD');
  const cancelForm = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onCancel();
  };

  const onFormSubmit = (values, actions) => {
    const payload = {
      ...values,
      birthdate: birthdate ? dateToString(birthdate) : form.birthdate,
      end_date: endDate ? dateToString(endDate) :  form.end_date,
    };

    values.id
      ? onEdit(payload)
      : onAdd(payload);

    actions.resetForm(emptyForm);
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
                  defaultDate: form.end_date,
                  value: endDate ? dateToString(endDate) : form.end_date,
                  minDate: today,
                }}
                locale={i18n.language}
                onChange={(dates) => setEndDate(moment(dates[0]))}
                id="end_date"
              />
            </div>

            <div className={classes.QuarantineFormField}>
              <label htmlFor="firstname">{t('common.firstname')}</label>
              <Field id="firstname" name="firstname" />
            </div>

            <div className={classes.QuarantineFormField}>
              <label htmlFor="birthdate">{t('common.birthdate')}</label>
              <DatePicker
                options={{
                  defaultDate: form.birthdate,
                  value: birthdate ? dateToString(birthdate) : form.birthdate,
                  maxDate: today,
                }}
                locale={i18n.language}
                onChange={(dates) => setBirthdate(moment(dates[0]))}
                id="birthdate"
              />
            </div>

            <div className={classes.QuarantineFormField}>
              <label htmlFor="lastname">{t('common.lastname')}</label>
              <Field id="lastname" name="lastname" />
            </div>

            <div className={classes.QuarantineFormField}>
              <label htmlFor="email">{t('common.email')}</label>
              <Field name="email" />
            </div>

            <div className={classes.QuarantineFormField}>
              <label htmlFor="phone_number">{t('common.phoneNumber')}</label>
              <Field name="phone_number" />
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
  t: PropTypes.object.isRequired,
  confirm: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
};

export default QuarantineForm;
