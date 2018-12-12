import React from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import LanguageCheckboxes from '../LanguageCheckboxes/LanguageCheckboxes';

import classes from './RegistryItemForm.module.css';
import Button from '../UI/Button/Button';
import DatePicker from '../UI/DatePicker/DatePicker';

const validationSchema = Yup.object().shape({
  agreementStart: Yup.string().required('Sopimuskauden aloitusaika puuttuu.'),
  agreementEnd: Yup.string().required('Sopimuskauden päättymisaika puuttuu.'),
  contactName: Yup.string().required('Yhteyshenkilön nimi puuttuu.'),
  contactPhone: Yup.string().required('Yhteyshenkilön puhelinnumero puuttuu.'),
  contactEmail: Yup.string()
    .email()
    .required('Yhteyshenkilön sähköpostiosoite puuttuu.'),
  extra: Yup.string(),
});

const registryItemForm = props => {
  return (
    <Formik
      initialValues={{
        agreementStart: props.agreementStart || '',
        agreementEnd: props.agreementEnd || '',
        contactName: props.contactName || '',
        contactPhone: props.contactPhone || '',
        contactEmail: props.contactEmail || '',
        languages: props.languages || [],
        extra: props.extra || '',
      }}
      validationSchema={validationSchema}
      onSubmit={values => {
        const payload = {
          oid: props.oid,
          agreement_start_date: values.agreementStart,
          agreement_end_date: values.agreementEnd,
          contact_name: values.contactName,
          contact_email: values.contactEmail,
          contact_phone_number: values.contactPhone,
          languages: values.languages,
          extra: values.extra,
        };
        props.onSubmit(payload);
      }}
      render={({ values, setFieldValue, isValid }) => (
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
                  <DatePicker
                    id="agreementStart"
                    options={{
                      defaultDate: props.agreementStart || null,
                      value: values.agreementStart,
                    }}
                    onChange={d => setFieldValue('agreementStart', d[0])}
                    tabIndex="1"
                  />
                </div>
                <div className={classes.Separator}>−</div>
                <div>
                  <label htmlFor="agreementEnd" className={classes.Label}>
                    Loppupäivämäärä
                  </label>
                  <DatePicker
                    id="agreementEnd"
                    options={{
                      defaultDate: props.agreementEnd || null,
                      value: values.agreementEnd,
                    }}
                    onChange={d => setFieldValue('agreementEnd', d[0])}
                    tabIndex="2"
                  />
                </div>
              </div>
            </div>
            <div className={classes.Languages}>
              <h3>Kielitutkinnot</h3>
              <LanguageCheckboxes
                languages={values.languages}
                onChange={languages => setFieldValue('languages', languages)}
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
                tabIndex="3"
              />
              <ErrorMessage
                name="contactName"
                component="span"
                className={classes.ErrorMessage}
              />
              <label htmlFor="contactEmail" className={classes.Label}>
                Sähköpostiosoite
              </label>
              <Field
                type="input"
                id="contactEmail"
                name="contactEmail"
                placeholder="essi.esimerkki@jarjestaja.fi"
                tabIndex="4"
              />
              <ErrorMessage
                name="contactEmail"
                component="span"
                className={classes.ErrorMessage}
              />
              <label htmlFor="contactPhone" className={classes.Label}>
                Puhelinnumero
              </label>
              <Field
                type="tel"
                id="contactPhone"
                name="contactPhone"
                placeholder="+358 01 234 5678"
                tabIndex="5"
              />
              <ErrorMessage
                name="contactPhone"
                component="span"
                className={classes.ErrorMessage}
              />
              <label htmlFor="extra" className={classes.Label}>
                Lisätiedot
              </label>
              <Field
                type="textarea"
                id="extra"
                name="extra"
                rows="5"
                cols="33"
                maxLength="255"
                wrap="soft"
                placeholder="Esim. Yleinen sähköpostilista: kaikille@jarjestaja.fi"
                tabIndex="6"
              />
              <ErrorMessage
                name="extra"
                component="span"
                className={classes.ErrorMessage}
              />
            </div>
          </div>

          <Button type="submit" disabled={!isValid} tabIndex="7">
            {props.modifying ? 'Tallenna muutokset' : 'Lisää järjestäjä'}
          </Button>
        </Form>
      )}
    />
  );
};

registryItemForm.propTypes = {
  oid: PropTypes.string,
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
  modifying: PropTypes.bool,
};

export default registryItemForm;
