import { FinnishSSN } from 'finnish-ssn';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { DATE_FORMAT, ISO_DATE_FORMAT_SHORT } from '../../../common/Constants';
import { useMobileView } from '../../../util/customHooks';
import FormikInputField from '../../FormikInputField/FormikInputField';
import PhoneNumberInput from '../../PhoneNumberInput/PhoneNumberInput';
import Button from '../../UI/Button/Button';
import Checkbox from '../../UI/Checkbox/Checkbox';
import RadioButton from '../../UI/RadioButton/RadioButton';
import ZipAndPostOffice from '../../ZipAndPostOffice/ZipAndPostOffice';
import RegistrationError from '../RegistrationError/RegistrationError';
import GenderSelect from './GenderSelect/GenderSelect';
import NationalitySelect from './NationalitySelect/NationalitySelect';
import classes from './RegistrationForm.module.css';

export const registrationForm = props => {
  const mandatoryErrorMsg = props.t('error.mandatory');
  const maxErrorMsg = props.t('error.max');
  const mobileOrTablet = useMobileView(true, true);

  function validatePhoneNumber(value) {
    if (value) {
      const phoneNumber = parsePhoneNumberFromString(value);
      return phoneNumber && phoneNumber.isValid();
    } else {
      return true;
    }
  }

  function validateSsn(value) {
    return !value || FinnishSSN.validate(value);
  }

  function validateBirthDate(value) {
    if (props.initData.user.ssn) {
      return true;
    }
    if (value) {
      const date = moment(value, DATE_FORMAT, true);
      if (date.isValid() || date.isBefore(moment())) {
        return true;
      } else {
        return this.createError({ message: props.t('error.birthdate') });
      }
    } else {
      return this.createError({ message: mandatoryErrorMsg });
    }
  }

  function sameEmail(confirmEmail) {
    return confirmEmail === this.parent.email;
  }

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
      .max(64, maxErrorMsg),
    nationality: Yup.string().required(mandatoryErrorMsg),
    ssn: Yup.string().test(
      'invalid-ssn',
      props.t('error.ssn.invalid'),
      validateSsn,
    ),
    confirmEmail: Yup.string().test(
      'same-email',
      props.t('error.confirmEmail'),
      sameEmail,
    ),
    birthdate: Yup.string().test(
      'invalid-birthdate',
      props.t('error.birthdate'),
      validateBirthDate,
    ),
    examLang: Yup.string().required(mandatoryErrorMsg),
    certificateLang: Yup.string().required(mandatoryErrorMsg),
    personalDataConsent: Yup.boolean()
      .required(mandatoryErrorMsg)
      .oneOf([true], mandatoryErrorMsg),
    termsOfUseConsent: Yup.boolean()
      .required(mandatoryErrorMsg)
      .oneOf([true], mandatoryErrorMsg),
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
      <fieldset id={id}>
        <label>{label}</label>

        {children}
        {error && value ? (
          <span className={classes.ErrorMessage}>{error}</span>
        ) : null}
      </fieldset>
    );
  };
  const CheckboxComponent = ({
    field: { name, value },
    setFieldValue,
    setTouched,
    datacy,
    label,
    ariaLabel,
    checkboxId,
    touched,
    ariaRequired,
  }) => {
    return (
      <Checkbox
        name={name}
        checked={value}
        datacy={datacy}
        onChange={() => {
          setFieldValue(name, !value);
          setTouched(
            {
              ...touched,
              [name]: true,
            },
            true,
          );
        }}
        checkboxId={checkboxId}
        label={label}
        ariaLabel={ariaLabel}
        ariaRequired={ariaRequired}
      />
    );
  };

  const PhoneNumberComponent = ({
    field: { name, value },
    datacy,
    setFieldValue,
    setTouched,
    touched,
  }) => {
    return (
      <PhoneNumberInput
        name={name}
        current={value}
        datacy={datacy}
        nationalities={props.initData.nationalities}
        onChange={n => {
          setFieldValue(name, n);
          setTouched(
            {
              ...touched,
              [name]: true,
            },
            true,
          );
        }}
      />
    );
  };

  const phoneNumberInputField = (setFieldValue, setTouched, touched) => (
    <div className={classes.InputFieldWrapper}>
      <label>{props.t(`registration.form.phoneNumber`)}</label>
      <Field
        component={PhoneNumberComponent}
        name={'phoneNumber'}
        value={'phoneNumber'}
        datacy={'input-phoneNumber'}
        setFieldValue={setFieldValue}
        setTouched={setTouched}
        touched={touched}
        type="tel"
        aria-label={props.t(`registration.form.aria.phoneNumber`)}
      />
      <ErrorMessage
        name={'phoneNumber'}
        data-cy={`input-error-phoneNumber`}
        component="span"
        className={classes.ErrorMessage}
      />
    </div>
  );

  const inputField = (name, placeholder = '', extra, type = 'text') => (
    <FormikInputField
      name={name}
      label={props.t(`registration.form.${name}`)}
      required
      extra={extra}
      type={type}
      placeholder={props.t(`registration.form.${name}`)}
    />
  );

  const readonlyWhenExistsInput = (name, initialValues, type) =>
    initialValues[name] && initialValues[name].length > 0 ? (
      <>
        <p className={classes.Label}>{props.t(`registration.form.${name}`)}</p>
        <span>{initialValues[name]}</span>
      </>
    ) : (
      inputField(name, null, null, type)
    );

  const showExamLang = () => {
    const lang = props.initData.exam_session.language_code;

    return !(lang === 'fin' || lang === 'swe');
  };

  const emptyIfAbsent = value => {
    return value ? value : '';
  };

  const getNationalityDesc = code => {
    const nationality = props.initData.nationalities.find(
      n => n.koodiArvo === code,
    );
    const metadata = nationality.metadata.find(m => m.kieli === 'FI');
    return metadata ? metadata.nimi : '';
  };

  return (
    <Formik
      initialValues={{
        firstName: emptyIfAbsent(props.initData.user.first_name),
        lastName: emptyIfAbsent(props.initData.user.last_name),
        streetAddress: emptyIfAbsent(props.initData.user.street_address),
        zip: emptyIfAbsent(props.initData.user.zip),
        postOffice: emptyIfAbsent(props.initData.user.post_office),
        nationality: props.initData.user.nationalities
          ? props.initData.user.nationalities[0]
          : '',
        ssn: emptyIfAbsent(props.initData.user.ssn),
        birthdate: '',
        gender: '',
        phoneNumber: '358',
        email: emptyIfAbsent(props.initData.user.email),
        confirmEmail: emptyIfAbsent(props.initData.user.email),
        examLang:
          props.initData.exam_session.language_code === 'swe' ? 'sv' : 'fi',
        certificateLang: 'fi',
        personalDataConsent: false,
        termsOfUseConsent: false,
      }}
      validationSchema={validationSchema}
      onSubmit={values => {
        const payload = {
          first_name: values.firstName,
          last_name: values.lastName,
          nationalities: [values.nationality],
          nationality_desc: getNationalityDesc(values.nationality),
          ssn: props.initData.user.ssn || values.ssn,
          birthdate: values.birthdate
            ? moment(values.birthdate, DATE_FORMAT).format(
                ISO_DATE_FORMAT_SHORT,
              )
            : null,
          gender: values.gender,
          certificate_lang: values.certificateLang,
          exam_lang: values.examLang,
          post_office: values.postOffice,
          zip: values.zip,
          street_address: values.streetAddress,
          phone_number: parsePhoneNumberFromString(values.phoneNumber).format(
            'E.164',
          ),
          email: values.email,
          personalDataConsent: values.personalDataConsent,
          termsOfUseConsent: values.termsOfUseConsent,
        };
        props.onSubmitRegistrationForm(props.initData.registration_id, payload);
      }}
      render={({
        values,
        isValid,
        errors,
        initialValues,
        setFieldValue,
        setTouched,
        touched,
      }) => (
        <Form className={classes.Form}>
          <div data-cy="registration-form">
            <p>{props.t('registration.form.info')}</p>
            <div className={classes.InputGroup}>
              <div>{readonlyWhenExistsInput('firstName', initialValues)}</div>
              <div>{readonlyWhenExistsInput('lastName', initialValues)}</div>
            </div>
            <div className={classes.InputGroup}>
              {inputField('streetAddress')}
              <ZipAndPostOffice
                mandatory
                values={values}
                setFieldValue={setFieldValue}
              />
            </div>

            {mobileOrTablet ? (
              <>
                <div className={classes.InputGroup}>
                  {phoneNumberInputField(setFieldValue, setTouched, touched)}
                </div>
                <div className={classes.InputGroup}>
                  {readonlyWhenExistsInput('email', initialValues, 'email')}

                  {!props.initData.user.email && (
                    <>{inputField('confirmEmail', null, null, 'email')}</>
                  )}
                </div>
              </>
            ) : (
              <div className={classes.InputGroup}>
                {phoneNumberInputField(setFieldValue, setTouched, touched)}
                {readonlyWhenExistsInput('email', initialValues, 'email')}
                {!props.initData.user.email && (
                  <>{inputField('confirmEmail', null, null, 'email')}</>
                )}
              </div>
            )}
            {!initialValues.nationality && (
              <NationalitySelect
                nationalities={props.initData.nationalities}
                className={classes.FormSelector}
              />
            )}
            {!props.initData.user.ssn && (
              <div className={classes.InputGroup}>
                {inputField(
                  'birthdate',
                  props.t('registration.form.birthdate.placeholder'),
                )}

                <GenderSelect
                  genders={props.initData.genders}
                  className={classes.FormSelector}
                />

                <div>
                  {inputField('ssn')}
                  <p> {props.t('registration.form.ssn.text')}</p>
                </div>
              </div>
            )}
            <div className={classes.InputGroup}>
              {showExamLang() && (
                <RadioButtonGroup
                  label={props.t('registration.form.examLang')}
                  value={values.examLang}
                  error={errors.examLang}
                >
                  <div className={classes.RadioButtons}>
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
                  </div>
                </RadioButtonGroup>
              )}

              <RadioButtonGroup
                label={props.t('registration.form.certificateLang')}
                value={values.certificateLang}
                error={errors.certificateLang}
              >
                <div className={classes.RadioButtons}>
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
                </div>
              </RadioButtonGroup>
            </div>
          </div>

          <p>{props.t('registration.form.specialArrangements.info')}</p>
          <p>{props.t('registration.form.summary.info')}</p>
          <>
            <div className={classes.ConsentContainer}>
              <article>
                <p>
                  <strong>
                    {props.t('registration.form.consent.heading')}
                  </strong>
                </p>
                <p>{props.t('registration.form.consent.info')}</p>
              </article>
              <div className={classes.ConsentCheckbox}>
                <Field
                  component={CheckboxComponent}
                  name={'termsOfUseConsent'}
                  value={'termsOfUseConsent'}
                  checkboxId={'termsOfUseConsent'}
                  datacy={'form-checkbox-terms'}
                  setFieldValue={setFieldValue}
                  touched={touched}
                  setTouched={setTouched}
                  ariaRequired={true}
                  label={props.t('registration.form.consent.confirm')}
                  ariaLabel={props.t('registration.form.consent.confirm')}
                />
                <ErrorMessage
                  name={'termsOfUseConsent'}
                  component="span"
                  className={classes.ErrorMessage}
                />
              </div>
            </div>
            <div className={classes.ConsentContainer}>
              <article>
                <p>
                  <strong>
                    {props.t('registration.form.personalData.consent.heading')}
                  </strong>
                </p>
                <a
                  href={'https://opintopolku.fi/wp/tietosuojaseloste/'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {props.t('common.yki.consent.link')}
                </a>
              </article>
              <div className={classes.ConsentCheckbox}>
                <Field
                  component={CheckboxComponent}
                  name={'personalDataConsent'}
                  value={'personalDataConsent'}
                  checkboxId={'personalDataConsent'}
                  setTouched={setTouched}
                  touched={touched}
                  setFieldValue={setFieldValue}
                  datacy={'form-checkbox-terms'}
                  ariaRequired={true}
                  onClick={() =>
                    setFieldValue(
                      'personalDataConsent',
                      !values.personalDataConsent,
                    )
                  }
                  label={props.t(
                    'registration.form.personalData.consent.confirm',
                  )}
                  ariaLabel={props.t(
                    'registration.form.personalData.consent.confirm',
                  )}
                />
                <ErrorMessage
                  name={'personalDataConsent'}
                  component="span"
                  className={classes.ErrorMessage}
                />
              </div>
            </div>
          </>
          <Button
            type="submit"
            isRegistration={true}
            datacy="form-submit-button"
            ariaLabel={props.t('registration.form.aria.submit.button')}
            disabled={!isValid || props.submitting}
          >
            {props.t('registration.form.submit.button')}
          </Button>
          {props.submitError && (
            <div data-cy="form-submit-error" className={classes.SubmitError}>
              <RegistrationError
                error={props.submitError}
                defaultKey={'error.registrationForm.submitFailed'}
              />
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

export default withTranslation()(registrationForm);
