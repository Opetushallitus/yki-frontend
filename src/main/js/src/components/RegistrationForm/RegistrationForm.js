import React from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { withNamespaces } from 'react-i18next';

import classes from './RegistrationForm.module.css';
import Button from '../UI/Button/Button';
import RadioButton from '../UI/RadioButton/RadioButton';

const registrationForm = props => {
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required(props.t('error.mandatory')),
    lastName: Yup.string().required(props.t('error.mandatory')),
    streetAddress: Yup.string().required(props.t('error.mandatory')),
    zip: Yup.string().required(props.t('error.mandatory')),
    postOffice: Yup.string().required(props.t('error.mandatory')),
    phoneNumber: Yup.string().required(props.t('error.mandatory')),
    email: Yup.string().required(props.t('error.mandatory')),
    examLang: Yup.string().required(props.t('error.mandatory')),
    certificateLang: Yup.string().required(props.t('error.mandatory')),
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

  const inputField = name => (
    <React.Fragment>
      <h3>{props.t(`registration.form.${name}`)}</h3>
      <Field
        name={name}
        data-cy={`input-${name}`}
        className={classes.TextInput}
      />
      <ErrorMessage
        name={name}
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
        firstName: props.formInitData.user.first_name,
        lastName: props.formInitData.user.last_name,
        streetAddress: props.formInitData.user.street_address,
        zip: props.formInitData.user.zip,
        postOffice: props.formInitData.user.post_office,
        phoneNumber: '',
        email: '',
        examLang: 'fi',
        certificateLang: 'fi',
      }}
      validationSchema={validationSchema}
      onSubmit={values => {
        console.log(values);
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
              {inputField('phoneNumber', initialValues)}
            </div>
            <div className={classes.FormElement}>
              {inputField('email', initialValues)}
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
          <Button type="submit" disabled={false}>
            Ilmoittaudu
          </Button>
        </Form>
      )}
    />
  );
};

registrationForm.propTypes = {
  formInitData: PropTypes.object.isRequired,
  // onSubmit: PropTypes.func.isRequired,
};

export default withNamespaces()(registrationForm);
