import { ErrorMessage, Field, Form, Formik } from 'formik';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import * as Yup from 'yup';

import { DATE_FORMAT } from '../../../common/Constants';
import * as actions from '../../../store/actions/index';
import { isoFormatDate } from '../../../util/util';
import classes from './ReEvaluationForm.module.css';

const mapDispatchToProps = dispatch => {
  return {
    onSubmitForm: (examId, formData) =>
      dispatch(actions.submitEvaluationForm(examId, formData)),
  };
};

const mapStateToProps = state => {
  return {
    evaluationOrderId: state.registration.evaluationOrderId,
  };
};

const ReEvaluationForm = props => {
  const { externalState, onSubmitForm, evaluationOrderId, pageHistory } = props;
  const { t } = useTranslation();
  const mandatoryErrorMsg = t('error.mandatory');
  const [subtestsFail, setSubTestsFail] = useState(false);

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

  useEffect(() => {
    if (externalState.subtests && externalState.subtests.length >= 1)
      setSubTestsFail(false);
  }, [externalState.subtests]);

  useEffect(() => {
    if (evaluationOrderId) {
      pageHistory.push({
        pathname: `/tarkistusarviointi/tilaus/${evaluationOrderId}`,
      });
    }
  }, [evaluationOrderId]);

  const inputField = (
    name,
    placeholder = '',
    extra,
    type = 'text',
    noLabel = false,
    style,
  ) => (
    <div className={classes.FieldColumn}>
      {!noLabel && <h3>{t(`registration.form.${name}`)}</h3>}
      <Field
        onFocus={() => {
          if (!externalState.subtests || externalState.subtests.length < 1)
            setSubTestsFail(true);
        }}
        name={name}
        data-cy={`input-${name}`}
        placeholder={placeholder}
        className={style ? style : classes.TextInput}
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
    </div>
  );

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email(t('error.email'))
      .required(mandatoryErrorMsg),
    firstName: Yup.string().required(mandatoryErrorMsg),
    lastName: Yup.string().required(mandatoryErrorMsg),
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
      first_names: values.firstName,
      last_name: values.lastName,
      email: values.email,
      subtests: externalState.subtests,
    };
    if (values.birthdate) payload.birthdate = isoFormatDate(values.birthdate);
    onSubmitForm(externalState.id, payload);
  };

  return (
    <Formik
      data-cy="reeval-form"
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
      render={({ values, isValid, errors }) => {
        return (
          <Form>
            <div className={classes.FieldRow}>
              {inputField('firstName')}
              {inputField('lastName')}
            </div>
            <div className={classes.FieldRow}>
              {inputField('birthdate')}
              {inputField('email')}
            </div>
            <div className={classes.FieldRow}>
              {inputField(
                'consent',
                '',
                t('registration.reeval.formpage.confirm'),
                'checkbox',
                true,
                classes.CheckBoxInput,
              )}
            </div>
            {subtestsFail && (
              <p className={classes.ErrorMessage} data-cy="subtest-error">
                {t('error.nosubtasks')}
              </p>
            )}
            <button
              role="link"
              data-cy="reeval-form-submit-button"
              disabled={
                !isValid ||
                (externalState.subtests && externalState.subtests.length < 1)
              }
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

export default connect(mapStateToProps, mapDispatchToProps)(ReEvaluationForm);
