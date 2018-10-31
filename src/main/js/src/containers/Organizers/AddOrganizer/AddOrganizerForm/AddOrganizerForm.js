import React from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { withFormik, Field, Form, ErrorMessage } from 'formik';

import classes from './AddOrganizerForm.module.css';
import ophStyles from '../../../../assets/css/oph-styles.css';
import LanguageSelect from '../../../../components/LanguageSelect/LanguageSelect';
import Button from '../../../../components/UI/Button/Button';

const validationSchema = Yup.object().shape({
  agreementStart: Yup.date().required('Sopimuskauden aloitusaika puuttuu.'),
  agreementEnd: Yup.date().required('Sopimuskauden päättymisaika puuttuu.'),
  contactName: Yup.string().required('Yhteyshenkilön nimi puuttuu.'),
  contactPhone: Yup.string().required('Yhteyshenkilön puhelinnumero puuttuu.'),
  contactEmail: Yup.string()
    .email()
    .required('Yhteyshenkilön sähköpostiosoite puuttuu.'),
  contactSharedEmail: Yup.string().email(),
});

const formikEnhancer = withFormik({
  validationSchema: validationSchema,
  mapPropsToValues: props => ({
    agreementStart: '',
    agreementEnd: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    contactSharedEmail: '',
    languages: [],
  }),
  handleSubmit: (values, { setSubmitting, props }) => {
    const languages = [];
    for (const lang in values.languages) {
      languages.push({
        language_code: lang.code,
        level_code: lang.level,
      });
    }
    const payload = {
      oid: values.oid,
      agreement_start_date: values.agreementStart,
      agreement_end_date: values.agreementEnd,
      contact_name: values.contactName,
      contact_email: values.contactEmail,
      contact_phone_number: values.contactPhone,
      contact_shared_email: values.contactSharedEmail,
      languages: languages,
    };
    setSubmitting(false);
    props.onSubmit(payload);
  },
  displayName: 'AddOrganizerForm',
});

const Fieldset = ({ name, label, ...rest }) => (
  <React.Fragment>
    <label
      htmlFor={name}
      className={[ophStyles['oph-label'], classes.Label].join(' ')}
    >
      {label}
    </label>
    <Field
      id={name}
      name={name}
      className={[ophStyles['oph-input'], classes.Fieldset].join(' ')}
      {...rest}
    />
    <ErrorMessage name={name} component="span" />
  </React.Fragment>
);

const addOrganizerForm = props => {
  return (
    <Form className={classes.Form}>
      <h1>{props.name}</h1>
      <h2>Sopimuskausi</h2>
      <Fieldset name="agreementStart" type="date" label="Alkaa" />
      <Fieldset name="agreementEnd" type="date" label="Loppuu" />
      <h2>Kielet</h2>
      <LanguageSelect
        value={props.values.topics}
        onChange={languages => props.setFieldValue('languages', languages)}
        onBlur={props.setFieldTouched}
        error={props.errors.topics}
        touched={props.touched.topics}
      />
      <h2>Yhteyshenkilö</h2>
      <Fieldset
        name="contactName"
        type="text"
        label="Nimi"
        placeholder="Essi Esimerkki"
      />
      <Fieldset
        name="contactPhone"
        type="tel"
        label="Puhelinnumero"
        placeholder="0101234567"
      />
      <Fieldset
        name="contactEmail"
        type="email"
        label="Sähköposti"
        placeholder="essi.esimerkki@oph.fi"
      />
      <Fieldset
        name="contactSharedEmail"
        type="email"
        label="Toissijainen Sähköposti"
        placeholder="toissijainen@oph.fi"
      />
      <Button
        type="button"
        clicked={props.handleReset}
        disabled={!props.dirty || props.isSubmitting}
      >
        Tyhjennä
      </Button>
      <Button type="submit" disabled={!props.dirty || props.isSubmitting}>
        Lisää Järjestäjä
      </Button>
    </Form>
  );
};

Fieldset.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  rest: PropTypes.any,
};

addOrganizerForm.propTypes = {
  name: PropTypes.string,
  onSubmit: PropTypes.func,
  values: PropTypes.object,
  touched: PropTypes.object,
  dirty: PropTypes.bool,
  errors: PropTypes.object,
  setFieldValue: PropTypes.func,
  setFieldTouched: PropTypes.func,
  isSubmitting: PropTypes.bool,
  handleReset: PropTypes.func,
};

export default formikEnhancer(addOrganizerForm);
