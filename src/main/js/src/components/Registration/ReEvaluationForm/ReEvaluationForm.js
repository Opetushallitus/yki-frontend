import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import * as Yup from 'yup';

import { PRIVACY_POLICY_LINK } from '../../../common/Constants';
import ScrollToError from '../../../ScrollToFormTop';
import * as actions from '../../../store/actions/index';
import {
  checkBirthDate,
  containsSpecialCharacters,
  isoFormatDate,
} from '../../../util/util';
import FormikInputField from '../../FormikInputField/FormikInputField';
import TextAndButton from '../../TextAndButton/TextAndButton';
import Button from '../../UI/Button/Button';
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
  const {
    externalState,
    onSubmitForm,
    evaluationOrderId,
    pageHistory,
    evaluationPrices,
  } = props;
  const { t } = useTranslation();
  const mandatoryErrorMsg = t('error.mandatory');

  function validateBirthDate(value) {
    const validation = checkBirthDate(value);
    if (validation.error) {
      return this.createError({ message: validation.error });
    }
    return true;
  }

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
      placeholder={t(`registration.form.${name}`)}
      required={required}
      customStyle={classes.TextInput}
    />
  );

  const toggleSelect = (key, values) => {
    const subtestsCopy = values.subtests.slice();
    const foundIndex = subtestsCopy.findIndex(x => x === key);
    if (foundIndex !== -1) {
      subtestsCopy.splice(foundIndex, 1);
    } else {
      subtestsCopy.push(key);
    }
    return subtestsCopy;
  };

  const priceElement = (price, values, setFieldValue) => {
    const active = values.subtests.findIndex(x => x === price.key) > -1;
    return (
      <Field
        key={price.key}
        component={TextAndButton}
        name={'subtests'}
        value={price.key}
        text1={price.title}
        text2={`${price.price} €`}
        elementKey={price.key}
        active={active}
        buttonLabel={t('registration.reeval.order')}
        onClick={() => {
          const newSubtestsArray = toggleSelect(price.key, values);
          setFieldValue('subtests', newSubtestsArray);
        }}
      />
    );
  };

  const calculatePrice = subtests => {
    let total = 0;
    if (subtests.length > 0) {
      subtests.forEach(subtest => {
        const item = evaluationPrices.find(x => x.key === subtest);
        total += item.price;
      });
    }
    return total;
  };

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
    subtests: Yup.array()
      .required(t('error.nosubtasks'))
      .min(1),
  });

  const onSubmit = values => {
    const payload = {
      first_names: values.firstName,
      last_name: values.lastName,
      email: values.email,
      subtests: values.subtests,
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
        subtests: [],
      }}
      validationSchema={validationSchema}
      onSubmit={values => {
        onSubmit(values);
      }}
      render={({
        values,
        isValid,
        errors,
        isSubmitting,
        setFieldValue,
        setTouched,
        touched,
      }) => {
        return (
          <Form id="form">
            <ScrollToError isValid={isValid} isSubmitting={isSubmitting} />
            <h2>{t('registration.reeval.formpage.title2')}</h2>
            {evaluationPrices.map(price => {
              return priceElement(price, values, setFieldValue);
            })}
            <ErrorMessage
              name={'subtests'}
              data-cy="no-subtests-error"
              component="span"
              className={classes.ErrorMessage}
            />
            <div className={classes.Total}>
              <strong>{t('registration.reeval.total')}: </strong>
              <strong data-cy="reeval-subtest-total">
                {calculatePrice(values.subtests)} €
              </strong>
            </div>
            <p>{t('registration.reeval.formpage.text')}</p>
            <br />
            <h2>{t('registration.reeval.formpage.title3')}</h2>
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
                  aria-label={t('common.newTab')}
                >
                  {t('common.yki.consent.link')}
                  <img
                    src={require('../../../assets/svg/external-link.svg')}
                    alt={t('common.newTab')}
                  />
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
            <Button
              type="submit"
              datacy="reeval-form-submit-button"
              ariaLabel={t('registration.reeval.formpage.button')}
              isRegistration={true}
            >
              {t('registration.reeval.formpage.button')}
            </Button>
          </Form>
        );
      }}
    />
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ReEvaluationForm);
