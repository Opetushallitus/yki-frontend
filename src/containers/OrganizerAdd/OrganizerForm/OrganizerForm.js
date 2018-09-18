/* eslint react/prop-types: 0 */
import React, { Component } from 'react';

import { connect } from 'react-redux';

import { Form, Field } from 'react-final-form';

import * as moment from 'moment';

import * as constants from '../../../common/Constants';
import * as api from '../../../api';
import Alert from '../../../components/Alert/Alert';
import { resetCreateOrganizer } from '../../../actions/index';

import ophStyles from '../../../oph-styles.css';
import styles from './OrganizerForm.css';

const mapStateToProps = state => {
  return {
    organizerAddResult: state.organizerAddResult,
  };
};

const fieldClass = ophStyles['oph-field'];
const labelClass = ophStyles['oph-label'];
const inputClass = ophStyles['oph-input'];
const requiredFieldClass = [
  ophStyles['oph-field'],
  ophStyles['oph-field-is-required'],
].join(' ');

const mapDispatchToProps = dispatch => {
  return {
    resetCreateOrganizer: () => dispatch(resetCreateOrganizer()),
  };
};

const getOrganizationName = org => {
  return org ? [org.nimi.fi, org.nimi.sv, org.nimi.en].filter(o => o)[0] : null;
};

const validDate = value =>
  moment(value, constants.DATE_FORMAT, true).isValid()
    ? undefined
    : 'Anna päivämäärä muodossa pp.kk.vvvv';

const required = value => (value ? undefined : 'Pakollinen');

const composeValidators = (...validators) => value =>
  validators.reduce((error, validator) => error || validator(value), undefined);

const onSubmit = values => {
  const request = {
    oid: values.oid,
    agreement_start_date: moment(
      values.validityStart,
      constants.DATE_FORMAT,
    ).toISOString(),
    agreement_end_date: moment(
      values.validityEnd,
      constants.DATE_FORMAT,
    ).toISOString(),
    contact_name: values.contactName,
    contact_email: values.contactPhoneNumber,
    contact_phone_number: values.contactEmail,
  };
  api.createOrganizer(request);
};

class OrganizerForm extends Component {
  render() {
    const {
      organization,
      organizerAddResult,
      resetCreateOrganizer,
    } = this.props;
    return (
      <React.Fragment>
        <Form
          onSubmit={onSubmit}
          initialValues={{
            oid: this.props.organization ? this.props.organization.oid : '',
            validityStart: moment(new Date()).format(constants.DATE_FORMAT),
          }}
          render={({ handleSubmit, form, pristine, values, invalid }) => (
            // {getOrganizationName(organization)}
            <form onSubmit={handleSubmit} className={styles.OrganizerForm}>
              <h4>{getOrganizationName(organization)}</h4>
              <Field
                name="validityStart"
                validate={composeValidators(required, validDate)}
              >
                {({ input, meta }) => (
                  <div className={requiredFieldClass}>
                    <label className={labelClass}>Alkupäivämäärä</label>
                    <input {...input} className={inputClass} type="text" />
                    {meta.error && meta.touched && <span>{meta.error}</span>}
                  </div>
                )}
              </Field>
              <Field
                name="validityEnd"
                validate={composeValidators(required, validDate)}
              >
                {({ input, meta }) => (
                  <div className={requiredFieldClass}>
                    <label className={labelClass}>Loppupäivämäärä</label>
                    <input {...input} className={inputClass} type="text" />
                    {meta.error && meta.touched && <span>{meta.error}</span>}
                  </div>
                )}
              </Field>
              <h4>Yhteyshenkilö</h4>
              <Field name="contactName" validate={required}>
                {({ input, meta }) => (
                  <div className={requiredFieldClass}>
                    <label className={labelClass}>Nimi</label>
                    <input {...input} type="text" className={inputClass} />
                    {meta.error && meta.touched && <span>{meta.error}</span>}
                  </div>
                )}
              </Field>
              <Field name="contactEmail" validate={required}>
                {({ input, meta }) => (
                  <div className={requiredFieldClass}>
                    <label className={labelClass}>Sähköposti</label>
                    <input {...input} className={inputClass} type="text" />
                    {meta.error && meta.touched && <span>{meta.error}</span>}
                  </div>
                )}
              </Field>
              <Field name="contactPhoneNumber" validate={required}>
                {({ input, meta }) => (
                  <div className={requiredFieldClass}>
                    <label className={labelClass}>Puhelinnumero</label>
                    <input {...input} className={inputClass} type="text" />
                    {meta.error && meta.touched && <span>{meta.error}</span>}
                  </div>
                )}
              </Field>
              <div className={styles.OrganizerFormSaveButton}>
                <button
                  type="submit"
                  disabled={pristine || invalid}
                  className={[
                    ophStyles['oph-button'],
                    ophStyles['oph-button-primary'],
                  ].join(' ')}
                >
                  Tallenna
                </button>
              </div>
            </form>
          )}
        />
        {organizerAddResult && (
          <Alert title="Järjestäjä lisätty" onClose={resetCreateOrganizer} />
        )}
      </React.Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OrganizerForm);
