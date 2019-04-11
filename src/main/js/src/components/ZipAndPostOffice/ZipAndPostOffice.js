import React, { Component } from 'react';
import { Field, ErrorMessage } from 'formik';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import axios from '../../axios';
import classes from './ZipAndPostOffice.module.css';

export class ZipAndPostOffice extends Component {
  getPostOffice(zip) {
    axios.get(`/yki/api/code/posti/${zip}`).then(res => {
      const metadata = res.data.metadata;
      if (metadata) {
        const postOfficeFI = metadata.find(m => m.kieli === 'FI').nimi;
        const postOfficeSV = metadata.find(m => m.kieli === 'SV').nimi;
        const postOffice =
          this.props.i18n.lang === 'sv' ? postOfficeSV : postOfficeFI;
        this.props.setFieldValue('postOffice', postOffice);
        this.props.setFieldValue('postOfficeFI', postOfficeFI);
        this.props.setFieldValue('postOfficeSV', postOfficeSV);
      }
    });
  }

  componentDidUpdate(prevProps) {
    const zip = this.props.values['zip'];
    if (zip !== prevProps.values['zip'] && zip.length === 5) {
      this.getPostOffice(zip);
    }
  }

  render() {
    return (
      <div className={classes.AddressInput}>
        <div className={classes.Zip}>
          <h3>
            {this.props.t('registration.form.input.zip')}
            {this.props.mandatory && ' *'}
          </h3>
          <Field
            component="input"
            name="zip"
            data-cy="input-zip"
            aria-label={this.props.t('registration.form.aria.input.zip')}
          />
          <ErrorMessage
            name="zip"
            data-cy="input-error-zip"
            component="span"
            className={classes.ErrorMessage}
          />
        </div>
        <div className={classes.PostOffice}>
          <h3>
            {this.props.t('registration.form.input.postOffice')}
            {this.props.mandatory && ' *'}
          </h3>
          <Field
            component="input"
            name="postOffice"
            data-cy="input-postOffice"
            aria-label={this.props.t('registration.form.aria.input.postOffice')}
          />
          <ErrorMessage
            name="postOffice"
            data-cy="input-error-postOffice"
            component="span"
            className={classes.ErrorMessage}
          />
        </div>
      </div>
    );
  }
}

ZipAndPostOffice.propTypes = {
  values: PropTypes.object.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  mandatory: PropTypes.bool,
};

export default withTranslation()(ZipAndPostOffice);
