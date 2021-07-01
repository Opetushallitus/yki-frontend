import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import * as Yup from 'yup';

import { PRIVACY_POLICY_LINK } from '../../../common/Constants';
import * as actions from '../../../store/actions/index';
import {
  checkBirthDate,
  containsSpecialCharacters,
  isoFormatDate,
} from '../../../util/util';
import FormikInputField from '../../FormikInputField/FormikInputField';
import Checkbox from '../../UI/Checkbox/Checkbox';
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

const CheckboxComponent = ({
  field: { name, value, onChange },
  datacy,
  label,
  ariaLabel,
  ariaRequired,
}) => {
  return (
    <Checkbox
      checkboxId={name}
      name={name}
      checked={value}
      datacy={datacy}
      onChange={onChange}
      label={label}
      ariaLabel={ariaLabel}
      ariaRequired={ariaRequired}
    />
  );
};

const ReEvaluationForm = props => {
  const { externalState, onSubmitForm, evaluationOrderId, pageHistory } = props;
  const { t } = useTranslation();
  const mandatoryErrorMsg = t('error.mandatory');
  const [subtestsFail, setSubTestsFail] = useState(false);

  function validateBirthDate(value) {
    const validation = checkBirthDate(value);
    if (validation.error) {
      return this.createError({ message: validation.error });
    }
    return true;
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

  const inputField = (name, required) => (
    <FormikInputField
      name={name}
      label={t(`registration.form.${name}`)}
      onFocus={() => {
        if (!externalState.subtests || externalState.subtests.length < 1)
          setSubTestsFail(true);
      }}
      placeholder={t(`registration.form.${name}`)}
      required={required}
      customStyle={classes.TextInput}
    />
  );

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email(t('error.email'))
      .required(mandatoryErrorMsg),
    firstName: Yup.string()
      .required(mandatoryErrorMsg)
      .test(
        'no-special-characters',
        t('error.specialCharacters'),
        value => !containsSpecialCharacters(value),
      ),
    lastName: Yup.string()
      .required(mandatoryErrorMsg)
      .test(
        'no-special-characters',
        t('error.specialCharacters'),
        value => !containsSpecialCharacters(value),
      ),
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
      render={({
        values,
        isValid,
        errors,
        setFieldValue,
        setTouched,
        touched,
      }) => {
        return (
          <Form>
            <div className={classes.FieldRow}>
              {inputField('firstName', true)}
              {inputField('lastName', true)}
            </div>
            <div className={classes.FieldRow}>
              {inputField('birthdate', true)}
              {inputField('email', true)}
            </div>
            <div className={classes.ConsentContainer}>
              <article>
                <p>
                  <strong>
                    {t('registration.form.personalData.consent.heading')}
                  </strong>
                </p>
                <a
                  href={PRIVACY_POLICY_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('common.yki.consent.link')}
                </a>
              </article>
              <div className={classes.ConsentCheckbox}>
                <Field
                  component={CheckboxComponent}
                  name={'consent'}
                  value={'consent'}
                  datacy={'input-consent'}
                  onChange={() => {
                    setFieldValue('consent', !values.consent);
                    setTouched(
                      {
                        ...touched,
                        consent: true,
                      },
                      true,
                    );
                  }}
                  label={t('registration.form.personalData.consent.confirm')}
                  ariaLabel={t(
                    'registration.form.personalData.consent.confirm',
                  )}
                  ariaRequired={true}
                />
                <ErrorMessage
                  name={'consent'}
                  component="span"
                  className={classes.ErrorMessage}
                />
              </div>
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
