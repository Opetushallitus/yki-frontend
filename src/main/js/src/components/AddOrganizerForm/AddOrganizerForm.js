import React from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { withFormik, Form, Field, ErrorMessage } from 'formik';
import Select from 'react-select';

import classes from './AddOrganizerForm.module.css';
import Button from '../UI/Button/Button';
import DatePicker from '../UI/DatePicker/DatePicker';

const validationSchema = Yup.object().shape({
  agreementStart: Yup.date().required('Sopimuskauden aloitusaika puuttuu.'),
  agreementEnd: Yup.date().required('Sopimuskauden päättymisaika puuttuu.'),
  contactName: Yup.string().required('Yhteyshenkilön nimi puuttuu.'),
  contactPhone: Yup.string().required('Yhteyshenkilön puhelinnumero puuttuu.'),
  contactEmail: Yup.string()
    .email()
    .required('Yhteyshenkilön sähköpostiosoite puuttuu.'),
  contactSharedEmail: Yup.string(),
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

const addOrganizerForm = props => {
  console.log(props.values);
  return (
    <Form className={classes.Form}>
      <h2>{props.name}</h2>
      <p>{props.address}</p>
      <hr />
      <div className={classes.FormElements}>
        <div className={classes.Agreement}>
          <h3>Järjestäjäsopimus</h3>
          <div className={classes.DatePickers}>
            <div>
              <label htmlFor="agreementStart" className={classes.Label}>
                Alkupäivämäärä
              </label>
              <DatePicker id="agreementStart" onChange={d => props.setFieldValue('agreementStart', d[0])} />
            </div>
            <div className={classes.Separator}>−</div>
            <div>
              <label htmlFor="agreementEnd" className={classes.Label}>
                Loppupäivämäärä
              </label>
              <DatePicker id="agreementEnd" onChange={d => props.setFieldValue('agreementEnd', d[0])} />
            </div>
          </div>
        </div>
        <div className={classes.Languages}>
          <h3>Kielitutkinnot</h3>
          <Select
            isMulti
            name="languageSelect"
            options={props.languages}
            theme={theme => ({
              ...theme,
              borderRadius: 2,
              controlHeight: 20,
              colors: {
                ...theme.colors,
                text: 'orangered',
                primary25: 'hotpink',
                primary: 'black',
              },
            })}
            placeholder="Valitse..."
            onChange={l => props.setFieldValue('languages', l)}
          />
        </div>
        <div className={classes.Contact}>
          <h3>Yhteyshenkilön tiedot</h3>
          <label htmlFor="contactName" className={classes.Label}>
            Nimi
          </label>
          <Field
            type="input"
            id="contactName"
            name="contactName"
            placeholder="Essi Esimerkki"
          />
          <ErrorMessage name="contactName" component="span" />
          <label htmlFor="contactEmail" className={classes.Label}>
            Sähköpostiosoite
          </label>
          <Field
            type="input"
            id="contactEmail"
            name="contactEmail"
            placeholder="essi.esimerkki@jarjestaja.fi"
          />
          <ErrorMessage name="contactEmail" component="span" />
          <label htmlFor="contactPhone" className={classes.Label}>
            Puhelinnumero
          </label>
          <Field
            type="tel"
            id="contactPhone"
            name="contactPhone"
            placeholder="+358 01 234 5678"
          />
          <ErrorMessage name="contactPhone" component="span" />
          <label htmlFor="contactSharedEmail" className={classes.Label}>
            Lisätiedot
          </label>
          <textarea
            name="contactSharedEmail"
            rows="5"
            cols="33"
            maxLength="255"
            wrap="soft"
            placeholder="Esim. Yleinen sähköpostilista: kaikille@jarjestaja.fi"
          />
          <ErrorMessage name="contactSharedEmail" component="span" />
        </div>
      </div>

      <Button type="submit" disabled={!props.dirty || props.isSubmitting}>
        Lisää Järjestäjä
      </Button>
    </Form>
  );
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
  address: PropTypes.string,
};

export default formikEnhancer(addOrganizerForm);
