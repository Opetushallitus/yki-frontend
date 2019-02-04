import React from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { withNamespaces } from 'react-i18next';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

import classes from './RegistrationForm.module.css';
import Button from '../../UI/Button/Button';
import RadioButton from '../../UI/RadioButton/RadioButton';
import Alert from '../../Alert/Alert';
import NationalitySelect from './NationalitySelect/NationalitySelect';

export const registrationForm = props => {
  function validatePhoneNumber(value) {
    if (value) {
      const phoneNumber = parsePhoneNumberFromString(value);
      return phoneNumber && phoneNumber.isValid();
    } else {
      return false;
    }
  }

  const mandatoryErrorMsg = props.t('error.mandatory');
  const maxErrorMsg = props.t('error.max');

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .required(mandatoryErrorMsg)
      .max(128, maxErrorMsg),
    lastName: Yup.string()
      .required(mandatoryErrorMsg)
      .max(128, maxErrorMsg),
    streetAddress: Yup.string()
      .required(mandatoryErrorMsg)
      .max(128, maxErrorMsg),
    zip: Yup.string()
      .required(mandatoryErrorMsg)
      .max(16, maxErrorMsg),
    postOffice: Yup.string()
      .required(mandatoryErrorMsg)
      .max(64, maxErrorMsg),
    phoneNumber: Yup.string()
      .required(mandatoryErrorMsg)
      .test(
        'invalid-phone-number',
        props.t('error.phoneNumber'),
        validatePhoneNumber,
      ),
    email: Yup.string()
      .email(props.t('error.email'))
      .required(mandatoryErrorMsg)
      .max(128, maxErrorMsg),
    examLang: Yup.string().required(mandatoryErrorMsg),
    certificateLang: Yup.string().required(mandatoryErrorMsg),
  });

  const RadioButtonComponent = ({
    field: { name, value, onChange },
    id,
    checkedValue,
    label,
  }) => {
    return (
      <RadioButton
        name={name}
        id={id}
        checkedValue={checkedValue}
        value={value}
        onChange={onChange}
        label={label}
      />
    );
  };

  const RadioButtonGroup = ({
    value,
    id,
    label,
    className,
    children,
    error,
  }) => {
    return (
      <div className={className} id={id}>
        <h3>{label}</h3>
        {children}
        {error && value ? (
          <span className={classes.ErrorMessage}>{error}</span>
        ) : null}
      </div>
    );
  };

  const readonlyField = (name, initialValues) => (
    <React.Fragment>
      <h3>{props.t(`registration.form.${name}`)}</h3>
      <span>{initialValues[name]}</span>
    </React.Fragment>
  );

  const inputField = (name, placeholder = '') => (
    <React.Fragment>
      <h3>{props.t(`registration.form.${name}`)}</h3>
      <Field
        name={name}
        data-cy={`input-${name}`}
        placeholder={placeholder}
        className={classes.TextInput}
      />
      <ErrorMessage
        name={name}
        data-cy={`input-error-${name}`}
        component="span"
        className={classes.ErrorMessage}
      />
    </React.Fragment>
  );

  const readonlyWhenExistsInput = (name, initialValues) => (
    <React.Fragment>
      <h3>{props.t(`registration.form.${name}`)}</h3>
      {initialValues[name] && initialValues[name].length > 0 ? (
        <span>{initialValues[name]}</span>
      ) : (
        inputField(name)
      )}
    </React.Fragment>
  );

  return (
    <Formik
      initialValues={{
        firstName: props.initData.user.first_name,
        lastName: props.initData.user.last_name,
        streetAddress: props.initData.user.street_address,
        zip: props.initData.user.zip,
        postOffice: props.initData.user.post_office,
        nationality: props.initData.user.nationalities
          ? props.initData.user.nationalities[0]
          : '',
        phoneNumber: '',
        email: '',
        examLang: 'fi',
        certificateLang: 'fi',
      }}
      validationSchema={validationSchema}
      onSubmit={values => {
        const payload = {
          first_name: values.firstName,
          last_name: values.lastName,
          nationalities: [values.nationality],
          ssn: props.initData.user.ssn,
          certificate_lang: values.certificateLang,
          exam_lang: values.examLang,
          post_office: values.postOffice,
          zip: values.zip,
          street_address: values.streetAddress,
          phone_number: parsePhoneNumberFromString(values.phoneNumber).format(
            'E.164',
          ),
          email: values.email,
        };
        props.onSubmitRegistrationForm(payload);
      }}
      render={({ values, isValid, errors, initialValues }) => (
        <Form className={classes.Form}>
          <div data-cy="registration-form">
            <p>{props.t('registration.form.info')}</p>
            <div className={classes.FormElement}>
              {readonlyWhenExistsInput('firstName', initialValues)}
            </div>
            <div className={classes.FormElement}>
              {readonlyWhenExistsInput('lastName', initialValues)}
            </div>
            <div className={classes.FormElement}>
              {readonlyField('streetAddress', initialValues)}
            </div>
            <div className={classes.FormElement}>
              {readonlyField('zip', initialValues)}{' '}
              <span>{initialValues['postOffice']}</span>
            </div>
            <div className={classes.FormElement}>
              {inputField('phoneNumber', '+358 40 123 4567')}
            </div>
            <div className={classes.FormElement}>{inputField('email')}</div>
            <div className={classes.FormElement}>
              {initialValues.nationality &&
              initialValues.nationality.length > 0 ? null : (
                <NationalitySelect
                  nationalities={props.initData.nationalities}
                />
              )}
            </div>
            <div
              className={[classes.FormElement, classes.RadiobuttonGroup].join(
                ' ',
              )}
            >
              <RadioButtonGroup
                label={props.t('registration.form.examLang')}
                value={values.examLang}
                error={errors.examLang}
              >
                <Field
                  component={RadioButtonComponent}
                  name="examLang"
                  id={'examLang-fi'}
                  checkedValue={'fi'}
                  label={props.t('common.language.fin')}
                />
                <Field
                  component={RadioButtonComponent}
                  name="examLang"
                  id={'examLang-sv'}
                  checkedValue={'sv'}
                  label={props.t('common.language.swe')}
                />
              </RadioButtonGroup>
            </div>
            <div
              className={[classes.FormElement, classes.RadiobuttonGroup].join(
                ' ',
              )}
            >
              <RadioButtonGroup
                label={props.t('registration.form.certificateLang')}
                value={values.certificateLang}
                error={errors.certificateLang}
              >
                <Field
                  component={RadioButtonComponent}
                  name="certificateLang"
                  id={'certificateLang-fi'}
                  checkedValue={'fi'}
                  label={props.t('common.language.fin')}
                />
                <Field
                  component={RadioButtonComponent}
                  name="certificateLang"
                  id={'certificateLang-sv'}
                  checkedValue={'sv'}
                  label={props.t('common.language.swe')}
                />
                <Field
                  component={RadioButtonComponent}
                  name="certificateLang"
                  id={'certificateLang-en'}
                  checkedValue={'en'}
                  label={props.t('common.language.eng')}
                />
              </RadioButtonGroup>
            </div>
          </div>
          <p>{props.t('registration.form.specialArrangements.info')}</p>
          <p>{props.t('registration.form.summary.info')}</p>
          <Button
            type="submit"
            disabled={!isValid || props.submitting}
            isRegistration={true}
            datacy="form-submit-button"
          >
            {props.t('registration.form.submit.button')}
          </Button>
          {props.submitError && (
            <div data-cy="form-submit-error" className={classes.SubmitError}>
              <Alert title={props.t('error.registrationForm.submitFailed')} />
            </div>
          )}
        </Form>
      )}
    />
  );
};

registrationForm.propTypes = {
  initData: PropTypes.object.isRequired,
  submitting: PropTypes.bool.isRequired,
  onSubmitRegistrationForm: PropTypes.func.isRequired,
  submitError: PropTypes.object,
};

export default withNamespaces()(registrationForm);
