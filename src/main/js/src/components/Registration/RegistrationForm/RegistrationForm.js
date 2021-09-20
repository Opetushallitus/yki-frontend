import { FinnishSSN } from 'finnish-ssn';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { DATE_FORMAT, ISO_DATE_FORMAT_SHORT } from '../../../common/Constants';
import ScrollToError from '../../../ScrollToFormTop';
import { useMobileView } from '../../../util/customHooks';
import { checkBirthDate, containsSpecialCharacters } from '../../../util/util';
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
import * as i18nKeys from "../../../common/LocalizationKeys";

export const registrationForm = props => {
  const mandatoryErrorMsg = props.t(i18nKeys.error_mandatory);
  const maxErrorMsg = props.t(i18nKeys.error_max);
  const mobileOrTablet = useMobileView(true, true);

  function validatePhoneNumber(value) {
    if (value) {
      const phoneNumber = parsePhoneNumberFromString(value);
      return phoneNumber && phoneNumber.isValid();
    } else {
      return false;
    }
  }

  function validateSsn(value) {
    return !value || FinnishSSN.validate(value);
  }

  function validateBirthDate(value) {
    if (props.initData.user.ssn) {
      return true;
    }
    const validation = checkBirthDate(value);
    if (validation.error) {
      return this.createError({ message: validation.error });
    }
    return true;
  }

  function sameEmail(confirmEmail) {
    return confirmEmail === this.parent.email;
  }

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .required(mandatoryErrorMsg)
      .max(128, maxErrorMsg)
      .test(
        'no-special-characters',
        props.t(i18nKeys.error_specialCharacters),
        value => !containsSpecialCharacters(value),
      ),
    lastName: Yup.string()
      .required(mandatoryErrorMsg)
      .max(128, maxErrorMsg)
      .test(
        'no-special-characters',
        props.t(i18nKeys.error_specialCharacters),
        value => !containsSpecialCharacters(value),
      ),
    streetAddress: Yup.string()
      .required(mandatoryErrorMsg)
      .max(128, maxErrorMsg)
      .test(
        'no-special-characters',
        props.t(i18nKeys.error_specialCharacters),
        value => !containsSpecialCharacters(value),
      ),
    zip: Yup.string()
      .required(mandatoryErrorMsg)
      .max(16, maxErrorMsg),
    postOffice: Yup.string()
      .required(mandatoryErrorMsg)
      .max(64, maxErrorMsg)
      .test(
        'no-special-characters',
        props.t(i18nKeys.error_specialCharacters),
        value => !containsSpecialCharacters(value),
      ),
    phoneNumber: Yup.string()
      .required(mandatoryErrorMsg)
      .test(
        'invalid-phone-number',
        props.t(i18nKeys.error_phoneNumber),
        validatePhoneNumber,
      ),
    email: Yup.string()
      .email(props.t(i18nKeys.error_email))
      .required(mandatoryErrorMsg)
      .max(64, maxErrorMsg),
    nationality: Yup.string()
      .required(mandatoryErrorMsg)
      .test('gender-select', mandatoryErrorMsg, value => {
        return value && value !== 'placeholder';
      }),
    gender: Yup.string(),
    ssn: Yup.string().test(
      'invalid-ssn',
      props.t(i18nKeys.error_ssn_invalid),
      validateSsn,
    ),
    confirmEmail: Yup.string().test(
      'same-email',
      props.t(i18nKeys.error_confirmEmail),
      sameEmail,
    ),
    birthdate: Yup.string().test(
      'invalid-birthdate',
      props.t(i18nKeys.error_birthdate),
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
        required={true}
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
      <label>{props.t(i18nKeys.registration_form_phoneNumber)} *</label>
      <Field
        component={PhoneNumberComponent}
        name={'phoneNumber'}
        value={'phoneNumber'}
        datacy={'input-phoneNumber'}
        setFieldValue={setFieldValue}
        setTouched={setTouched}
        touched={touched}
        type="tel"
        aria-label={props.t(i18nKeys.registration_form_aria_phoneNumber)}
      />
      <ErrorMessage
        name={'phoneNumber'}
        data-cy={`input-error-phoneNumber`}
        component="span"
        className={classes.ErrorMessage}
      />
    </div>
  );

  const inputField = (name, required, extra, type = 'text', placeholder) => {
    const isEmailInput = (name === 'email' || name === 'confirmEmail');
    const handler = isEmailInput ? handleEmailActions : undefined;
    
    return (
      <FormikInputField
        name={name}
        label={props.t(`registration.form.${name}`)} // FIXME
        required={required}
        extra={extra}
        type={type}
        autoComplete={isEmailInput ? "off" : undefined}
        onContextMenu={handler}
        onPaste={handler}
        onCopy={handler}
        onCut={handler}
        placeholder={placeholder || props.t(`registration.form.${name}`)} // FIXME
      />
    )
  };


  /**
   * Returns default disabled actions for the email inputs
   * 
   * @returns false or undefined
   */
  const handleEmailActions = (e) => {
    e.preventDefault();
    return false;
  }

  const readonlyWhenExistsInput = (name, initialValues, type) =>
    initialValues[name] && initialValues[name].length > 0 ? (
      <>
        <p className={classes.Label}>{props.t(`registration.form.${name}`)}</p>// FIXME
        <span>{initialValues[name]}</span>
      </>
    ) : (
      inputField(name, true, null, type)
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
        submitCount,
        errors,
        isSubmitting,
        initialValues,
        setFieldValue,
        setTouched,
        touched,
      }) => (
        <Form className={classes.Form} id="form">
          <ScrollToError isValid={isValid} isSubmitting={isSubmitting} />
          <div data-cy="registration-form">
            <p>{props.t(i18nKeys.registration_form_info)}</p>
            <div className={classes.InputGroup}>
              <div>{readonlyWhenExistsInput('firstName', initialValues)}</div>
              <div>{readonlyWhenExistsInput('lastName', initialValues)}</div>
            </div>
            <div className={classes.InputGroup}>
              {inputField(
                'streetAddress',
                true,
                null,
                'text',
                props.t(i18nKeys.registration_form_streetAddress_placeholder),
              )}
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
                    <>{inputField('confirmEmail', true, null, 'email')}</>
                  )}
                </div>
              </>
            ) : (
              <div className={classes.InputGroup}>
                {phoneNumberInputField(setFieldValue, setTouched, touched)}
                {readonlyWhenExistsInput('email', initialValues, 'email')}
                {!props.initData.user.email && (
                  <>{inputField('confirmEmail', true, null, 'email')}</>
                )}
              </div>
            )}
            {!initialValues.nationality && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <NationalitySelect
                  nationalities={props.initData.nationalities}
                  className={classes.FormSelector}
                />
                <ErrorMessage
                  name={'nationality'}
                  data-cy={`input-error-nationality`}
                  component="span"
                  className={classes.ErrorMessage}
                />
              </div>
            )}
            {!props.initData.user.ssn && (
              <div className={classes.InputGroup}>
                {inputField('birthdate', true)}

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <GenderSelect
                    genders={props.initData.genders}
                    className={classes.FormSelector}
                  />
                  <ErrorMessage
                    name={'gender'}
                    data-cy={`input-error-gender`}
                    component="span"
                    className={classes.ErrorMessage}
                  />
                </div>
                <div>
                  {inputField('ssn')}
                  <p> {props.t(i18nKeys.registration_form_ssn_text)}</p>
                </div>
              </div>
            )}
            <div className={classes.InputGroup}>
              {showExamLang() && (
                <RadioButtonGroup
                  label={props.t(i18nKeys.registration_form_examLang)}
                  value={values.examLang}
                  error={errors.examLang}
                >
                  <div className={classes.RadioButtons}>
                    <Field
                      component={RadioButtonComponent}
                      name="examLang"
                      id={'examLang-fi'}
                      checkedValue={'fi'}
                      label={props.t(i18nKeys.common_language_fin)}
                    />
                    <Field
                      component={RadioButtonComponent}
                      name="examLang"
                      id={'examLang-sv'}
                      checkedValue={'sv'}
                      label={props.t(i18nKeys.common_language_swe)}
                    />
                  </div>
                </RadioButtonGroup>
              )}

              <RadioButtonGroup
                label={props.t(i18nKeys.registration_form_certificateLang)}
                value={values.certificateLang}
                error={errors.certificateLang}
              >
                <div className={classes.RadioButtons}>
                  <Field
                    component={RadioButtonComponent}
                    name="certificateLang"
                    id={'certificateLang-fi'}
                    checkedValue={'fi'}
                    label={props.t(i18nKeys.common_language_fin)}
                  />
                  <Field
                    component={RadioButtonComponent}
                    name="certificateLang"
                    id={'certificateLang-sv'}
                    checkedValue={'sv'}
                    label={props.t(i18nKeys.common_language_swe)}
                  />
                  <Field
                    component={RadioButtonComponent}
                    name="certificateLang"
                    id={'certificateLang-en'}
                    checkedValue={'en'}
                    label={props.t(i18nKeys.common_language_eng)}
                  />
                </div>
              </RadioButtonGroup>
            </div>
          </div>

          <p>{props.t(i18nKeys.registration_form_specialArrangements_info)}</p>
          <p>{props.t(i18nKeys.registration_form_summary_info)}</p>
          <>
            <div className={classes.ConsentContainer}>
              <article>
                <p>
                  <strong>
                    {props.t(i18nKeys.registration_form_consent_heading)}
                  </strong>
                </p>
                <p>{props.t(i18nKeys.registration_form_consent_info)}</p>
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
                  label={props.t(i18nKeys.registration_form_consent_confirm)}
                  ariaLabel={props.t(i18nKeys.registration_form_consent_confirm)}
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
                    {props.t(i18nKeys.registration_form_personalData_consent_heading)}
                  </strong>
                </p>
                <a
                  href={'https://opintopolku.fi/wp/tietosuojaseloste/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={props.t(i18nKeys.common_newTab)}
                >
                  {props.t(i18nKeys.common_yki_consent_link)}
                  <img
                    src={require('../../../assets/svg/external-link.svg')}
                    alt={props.t(i18nKeys.common_newTab)}
                  />
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
                  datacy={'form-checkbox-personal-data'}
                  ariaRequired={true}
                  onClick={() =>
                    setFieldValue(
                      'personalDataConsent',
                      !values.personalDataConsent,
                    )
                  }
                  label={props.t(
                    i18nKeys.registration_form_personalData_consent_confirm,
                  )}
                  ariaLabel={props.t(
                    i18nKeys.registration_form_personalData_consent_confirm,
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
            disabled={props.submitting}
            isRegistration={true}
            datacy="form-submit-button"
            ariaLabel={props.t(i18nKeys.registration_form_aria_submit_button)}
          >
            {props.t(i18nKeys.registration_form_submit_button)}
          </Button>
          {props.submitError && (
            <div data-cy="form-submit-error" className={classes.SubmitError}>
              <RegistrationError
                error={props.submitError}
                defaultKey={i18nKeys.error_registrationForm_submitFailed}
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
