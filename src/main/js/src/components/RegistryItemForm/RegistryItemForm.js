import { ErrorMessage, Field, Form, Formik } from 'formik';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { DATE_FORMAT } from '../../common/Constants';
import LanguageCheckboxes from '../LanguageCheckboxes/LanguageCheckboxes';
import Button from '../UI/Button/Button';
import DatePicker from '../UI/DatePicker/DatePicker';
import AgreementPdf from './AgreementPdf/AgreementPdf';
import classes from './RegistryItemForm.module.css';

const registryItemForm = props => {
  const validationSchema = Yup.object().shape({
    agreementStart: Yup.string().required(
      props.t('registryItem.agreementStart.required'),
    ),
    agreementEnd: Yup.string().required(
      props.t('registryItem.agreementEnd.required'),
    ),
    contactName: Yup.string().required(
      props.t('registryItem.contactName.required'),
    ),
    contactPhone: Yup.string().required(
      props.t('registryItem.contactPhone.required'),
    ),
    contactEmail: Yup.string()
      .email()
      .required(props.t('registryItem.contactEmail.required')),
    extra: Yup.string(),
    merchantId: Yup.number()
      .typeError(props.t('error.numeric'))
      .max(99999999999, props.t('error.max')),
    merchantSecret: Yup.string()
      .when('merchantId', {
        is: val => val,
        then: Yup.string().required(
          props.t('registryItem.merchantSecret.mandatory'),
        ),
      })
      .max(30, props.t('error.max')),
  });

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
        merchantId: (props.merchant && props.merchant.merchant_id) || '',
        merchantSecret:
          (props.merchant && props.merchant.merchant_secret) || '',
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
          merchant: values.merchantId
            ? {
                merchant_id: Number.parseInt(values.merchantId),
                merchant_secret: values.merchantSecret,
              }
            : null,
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
              <h3>{props.t('common.agreement')}</h3>
              <div className={classes.DatePickers}>
                <div>
                  <label htmlFor="agreementStart" className={classes.Label}>
                    {props.t('registryItem.agreementStart')}
                  </label>
                  <DatePicker
                    id="agreementStart"
                    options={{
                      defaultDate: props.agreementStart,
                      value: values.agreementStart,
                    }}
                    onChange={d =>
                      setFieldValue(
                        'agreementStart',
                        moment(d[0], DATE_FORMAT).toISOString(),
                      )
                    }
                    locale={props.i18n.language}
                    tabIndex="1"
                  />
                </div>
                <div className={classes.Separator}>−</div>
                <div>
                  <label htmlFor="agreementEnd" className={classes.Label}>
                    {props.t('registryItem.agreementEnd')}
                  </label>
                  <DatePicker
                    id="agreementEnd"
                    options={{
                      defaultDate: props.agreementEnd,
                      value: values.agreementEnd,
                    }}
                    onChange={d =>
                      setFieldValue(
                        'agreementEnd',
                        moment(d[0], DATE_FORMAT).toISOString(),
                      )
                    }
                    locale={props.i18n.language}
                    tabIndex="2"
                  />
                </div>
              </div>
              {props.updating && (
                <AgreementPdf
                  oid={props.oid}
                  attachmentId={props.attachmentId}
                />
              )}
            </div>
            <div className={classes.Languages}>
              <h3>{props.t('common.exam.languages')}</h3>
              <LanguageCheckboxes
                languages={values.languages}
                onChange={languages => setFieldValue('languages', languages)}
              />
            </div>
            <div className={classes.Contact}>
              <h3>{props.t('registryItem.contactHeader')}</h3>
              <label htmlFor="contactName" className={classes.Label}>
                {props.t('registryItem.contactName')}
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
                {props.t('registryItem.contactEmail')}
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
                {props.t('registryItem.contactPhone')}
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
                {props.t('registryItem.extra')}
              </label>
              <Field
                type="textarea"
                id="extra"
                name="extra"
                rows="5"
                cols="33"
                maxLength="255"
                wrap="soft"
                placeholder={props.t('registryItem.extra.placeholder')}
                tabIndex="6"
              />
              <ErrorMessage
                name="extra"
                component="span"
                className={classes.ErrorMessage}
              />
            </div>
            <div className={classes.PaymentInfo}>
              <h3>{props.t('registryItem.payment')}</h3>
              <label htmlFor="contactName" className={classes.Label}>
                {props.t('registryItem.merchantId')}
              </label>
              <Field
                type="input"
                id="merchantId"
                name="merchantId"
                tabIndex="7"
              />
              <ErrorMessage
                name="merchantId"
                component="span"
                className={classes.ErrorMessage}
              />
              <label htmlFor="merchantSecret" className={classes.Label}>
                {props.t('registryItem.merchantSecret')}
              </label>
              <Field
                type="input"
                id="merchantSecret"
                name="merchantSecret"
                tabIndex="8"
              />
              <ErrorMessage
                name="merchantSecret"
                component="span"
                className={classes.ErrorMessage}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={!isValid}
            tabIndex="9"
            datacy="registry-item-form-submit"
          >
            {props.updating
              ? props.t('registryItem.button.update')
              : props.t('registryItem.button.add')}
          </Button>
        </Form>
      )}
    />
  );
};

registryItemForm.propTypes = {
  agreementStart: PropTypes.string,
  agreementEnd: PropTypes.string,
  contactName: PropTypes.string,
  contactPhone: PropTypes.string,
  contactEmail: PropTypes.string,
  languages: PropTypes.array,
  extra: PropTypes.string,
  oid: PropTypes.string,
  attachmentId: PropTypes.string,
  name: PropTypes.string,
  merchant: PropTypes.object,
  onSubmit: PropTypes.func,
  address: PropTypes.string,
  updating: PropTypes.bool,
};

export default withTranslation()(registryItemForm);
