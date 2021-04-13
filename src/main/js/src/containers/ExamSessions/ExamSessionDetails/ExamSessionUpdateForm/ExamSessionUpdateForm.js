import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import moment from 'moment';
import { withTranslation } from 'react-i18next';

import classes from './ExamSessionUpdateForm.module.css';
import Button from '../../../../components/UI/Button/Button';
import ActionButton from '../../../../components/UI/ActionButton/ActionButton';
import {
  DATE_FORMAT,
  DATE_FORMAT_WITHOUT_YEAR,
} from '../../../../common/Constants';
import ZipAndPostOffice from '../../../../components/ZipAndPostOffice/ZipAndPostOffice';
import SessionContact from '../../../../components/SessionContact/SessionContact';

export class ExamSessionUpdateForm extends Component {
  render() {
    const { t, examSession } = this.props;
    const contact = examSession.contact && examSession.contact[0];

    const validationSchema = Yup.object().shape({
      maxParticipants: Yup.number()
        .typeError(t('error.numeric'))
        .required(t('error.mandatory'))
        .min(
          examSession.participants,
          t('examSession.maxParticipants.lessThan.participants'),
        )
        .integer(),
      streetAddress: Yup.string().required(t('error.mandatory')),
      postOffice: Yup.string().required(t('error.mandatory')),
      zip: Yup.string()
        .matches(/\b\d{5}\b/, {
          message: t('error.zip'),
        })
        .required(t('error.mandatory')),
      location: Yup.string(),
      extraFi: Yup.string(),
      extraSe: Yup.string(),
      extraEn: Yup.string(),
    });

    const registrationPediod = examSession => {
      const start = moment(examSession.registration_start_date).format(
        DATE_FORMAT_WITHOUT_YEAR,
      );
      const end = moment(examSession.registration_end_date).format(DATE_FORMAT);
      return (
        <label>
          {start} &ndash; {end}
        </label>
      );
    };

    const deleteButton = examSession => {
      // It is possible to delete the exam session on the registration start day before 10am
      const registrationNotStarted = moment().subtract(1, 'days').isBefore(
        moment(examSession.registration_start_date),
      );

      const canBeDeleted = !examSession.open && examSession.participants === 0 && registrationNotStarted;
      return canBeDeleted ? (
        <div className={classes.ActionButton}>
          <ActionButton
            onClick={this.props.onDelete}
            confirmOnRight={true}
            children={t('examSession.delete')}
            confirmText={t('common.confirm')}
            cancelText={t('common.cancelConfirm')}
          />
        </div>
      ) : null;
    };

    const getLocationByLang = lang => {
      const location = examSession.location.find(
        l => l.lang === lang,
      );
      return location ? location : examSession.location[0];
    };

    const getLocationExtraByLang = lang => {
      const location = getLocationByLang(lang);
      return location && location.extra_information
        ? location.extra_information
        : '';
    };

    const getLocationNameByLang = lang => {
      const location = getLocationByLang(lang);
      return location.name;
    };

    const createRegistrationUrl = examSessionId => {
      return `https://${window.location.hostname.replace(
        'virkailija',
        'yki',
      )}/yki/tutkintotilaisuus/${examSessionId}`;
    };


    return (
      <Formik
        initialValues={{
          maxParticipants: examSession.max_participants,
          streetAddress: getLocationByLang(this.props.i18n.language)
            .street_address,
          postOffice: getLocationByLang(this.props.i18n.language).post_office,
          zip: examSession.location[0].zip,
          location: getLocationByLang(this.props.i18n.language)
            .other_location_info,
          extraFi: getLocationExtraByLang('fi'),
          extraSv: getLocationExtraByLang('sv'),
          extraEn: getLocationExtraByLang('en'),
          contactName: contact ? contact.name : "",
          contactEmail: contact ? contact.email : "",
          contactPhoneNumber: contact ? contact.phone_number : "",
        }}
        validationSchema={validationSchema}
        onSubmit={values => {
          const payload = {
            ...examSession,
            max_participants: Number.parseInt(values.maxParticipants),
            contact: values.contactName || values.contactEmail || values.contactPhoneNumber
              ? [{
                name: values.contactName,
                email: values.contactEmail,
                phone_number: values.contactPhoneNumber
              }] : null,
            location: [
              {
                name: getLocationNameByLang('fi'),
                street_address: values.streetAddress,
                post_office: values.postOfficeFI
                  ? values.postOfficeFI
                  : values.postOffice,
                zip: values.zip,
                other_location_info: values.location,
                extra_information: values.extraFi,
                lang: 'fi',
              },
              {
                name: getLocationNameByLang('sv'),
                street_address: values.streetAddress,
                post_office: values.postOfficeSV
                  ? values.postOfficeSV
                  : values.postOffice,
                zip: values.zip,
                other_location_info: values.location,
                extra_information: values.extraSv,
                lang: 'sv',
              },
              {
                name: getLocationNameByLang('en'),
                street_address: values.streetAddress,
                post_office: values.postOfficeFI
                  ? values.postOfficeFI
                  : values.postOffice,
                zip: values.zip,
                other_location_info: values.location,
                extra_information: values.extraEn,
                lang: 'en',
              },
            ],
          };
          this.props.onSubmit(payload);
        }}
        render={({ isValid, setFieldValue, values }) => (
          <Form className={classes.Form}>
            <div>
              <div className={classes.FormElement}>
                <h3>{t('common.registationPeriod')}</h3>
                {registrationPediod(examSession)}
              </div>
              <div className={classes.FormElement}>
                <h3>{t('examSession.registrationLink')}</h3>
                <label data-cy="registration-link">
                  {createRegistrationUrl(examSession.id)}
                </label>
              </div>
              <div className={classes.FormElement}>
                <h3>{`${t('examSession.maxParticipants')} *`}</h3>
                <Field
                  id="maxParticipants"
                  name="maxParticipants"
                  data-cy="input-max-participants"
                  className={classes.MaxParticipantsInput}
                />
                <ErrorMessage
                  name="maxParticipants"
                  component="span"
                  className={classes.ErrorMessage}
                />
              </div>
              <div className={classes.FormElement}>
                <h3>{`${t('common.address')} *`}</h3>
                <Field
                  id="streetAddress"
                  name="streetAddress"
                  data-cy="input-address"
                  className={classes.TextInput}
                />
                <ErrorMessage
                  name="streetAddress"
                  component="span"
                  className={classes.ErrorMessage}
                />
              </div>
              <div className={classes.FormElement}>
                <ZipAndPostOffice
                  values={values}
                  setFieldValue={setFieldValue}
                  mandatory={true}
                />
              </div>
              <div className={classes.FormElement}>
                <h3>{t('common.location')}</h3>
                <Field
                  id="location"
                  name="location"
                  data-cy="input-location"
                  className={classes.TextInput}
                />
                <ErrorMessage
                  name="location"
                  component="span"
                  className={classes.ErrorMessage}
                />
              </div>
            </div>
            <div>
              <SessionContact />
              <div>
                <div className={classes.FormElement}>
                  <h3>{t('common.extra')}</h3>
                  <label className={classes.ExtraLabel}>
                    {t('common.language.fin')}
                  </label>
                  <Field
                    component="textarea"
                    id="extraFi"
                    name="extraFi"
                    data-cy="input-extra-fi"
                    rows={3}
                    cols={33}
                    maxLength="2048"
                    wrap="soft"
                    className={classes.TextArea}
                  />
                  <ErrorMessage
                    name="extraFi"
                    component="span"
                    className={classes.ErrorMessage}
                  />
                </div>
                <div className={classes.FormElement}>
                  <label className={classes.ExtraLabel}>
                    {t('common.language.swe')}
                  </label>
                  <Field
                    component="textarea"
                    id="extraSv"
                    name="extraSv"
                    data-cy="input-extra-sv"
                    rows={3}
                    cols={33}
                    maxLength="2048"
                    wrap="soft"
                    className={classes.TextArea}
                  />
                  <ErrorMessage
                    name="extraSv"
                    component="span"
                    className={classes.ErrorMessage}
                  />
                </div>
                <div className={classes.FormElement}>
                  <label className={classes.ExtraLabel}>
                    {t('common.language.eng')}
                  </label>
                  <Field
                    component="textarea"
                    id="extraEn"
                    name="extraEn"
                    data-cy="input-extra-en"
                    rows={3}
                    cols={33}
                    maxLength="2048"
                    wrap="soft"
                    className={classes.TextArea}
                  />
                  <ErrorMessage
                    name="extraEn"
                    component="span"
                    className={classes.ErrorMessage}
                  />
                </div>
              </div>

              <div className={classes.Buttons}>
                {deleteButton(examSession)}
                <Button
                  type="submit"
                  disabled={!isValid}
                  className={classes.UpdateButton}
                >
                  {t('registryItem.button.update')}
                </Button>
              </div>
            </div>
          </Form>
        )}
      />
    );
  }
}

ExamSessionUpdateForm.propTypes = {
  examSession: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default withTranslation()(ExamSessionUpdateForm);
