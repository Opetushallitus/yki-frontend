import { ErrorMessage, Field, Form, Formik } from 'formik';
import moment from 'moment';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import * as Yup from 'yup';

import { DATE_FORMAT, ISO_DATE_FORMAT_SHORT } from '../../../common/Constants';
import { isoFormatDate } from '../../../util/util';
import classes from './ReEvaluationForm.module.css';

const ReEvaluationForm = props => {
  const { externalState } = props;
  const { t } = useTranslation();
  const mandatoryErrorMsg = t('error.mandatory');

  function validateBirthDate(value) {
    if (value) {
      const date = moment(value, DATE_FORMAT, true);
      if (date.isValid() && date.isBefore(moment())) {
        return true;
      } else {
        return this.createError({
          message: t('error.birthdate'),
        });
      }
    } else {
      return this.createError({
        message: mandatoryErrorMsg,
      });
    }
  }

  const inputField = (
    name,
    placeholder = '',
    extra,
    type = 'text',
    noLabel = false,
  ) => (
    <>
      {!noLabel && <h3>{t(`registration.form.${name}`)}</h3>}
      <Field
        name={name}
        data-cy={`input-${name}`}
        placeholder={placeholder}
        className={classes.TextInput}
        type={type}
        aria-label={`registration.form.aria.${name}`}
      />
      {extra && <span>{extra}</span>}
      <ErrorMessage
        name={name}
        data-cy={`input-error-${name}`}
        component="span"
        className={classes.ErrorMessage}
      />
    </>
  );

  const validationSchema = Yup.object().shape({
    email: Yup.string().email(t('error.email')),
    firstName: Yup.string(),
    lastName: Yup.string(),
    birthdate: Yup.string().test(
      'invalid-birthdate',
      t('error.birthdate'),
      validateBirthDate,
    ),
    consent: Yup.boolean()
      .required(mandatoryErrorMsg)
      .oneOf([true], mandatoryErrorMsg),
  });

  const onSubmit = values => {
    const payload = {
      ...values,
      ...externalState,
    };
    if (values.birthdate) payload.birthdate = isoFormatDate(values.birthdate);

    console.log('SUBMIT', payload);
  };

  return (
    <Formik
      initialValues={{
        firstName: '',
        lastName: '',
        birthdate: '',
        email: '',
        consent: false,
      }}
      validationSchema={validationSchema}
      onSubmit={values => {
        onSubmit(values);
      }}
      render={({ values, isValid, errors, setFieldValue }) => {
        console.log(isValid, errors, values);
        return (
          <Form>
            {inputField('firstName')}
            {inputField('lastName')}
            {inputField('birthdate')}
            {inputField('email')}
            {inputField(
              'consent',
              '',
              t('registration.form.consent.confirm'),
              'checkbox',
              true,
            )}

            <button
              role="link"
              className="YkiButton"
              style={{
                padding: '0.25rem',
              }}
            >
              {t('registration.reeval.formpage.button')}
            </button>
          </Form>
        );
      }}
    />
  );
};

export default ReEvaluationForm;
