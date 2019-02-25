import React, { Component } from 'react';
import { Field, ErrorMessage } from 'formik';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import axios from '../../../../axios';
import classes from './ZipAndPostOffice.module.css';

export class ZipAndPostOffice extends Component {
  getPostOffice(zip) {
    axios.get(`/yki/api/code/posti/${zip}`).then(res => {
      const metadata = res.data.metadata;
      if (metadata) {
        const postOffice =
          this.props.lng === 'sv'
            ? metadata.find(m => m.kieli === 'SV').nimi
            : metadata.find(m => m.kieli === 'FI').nimi;
        this.props.setFieldValue('postOffice', postOffice);
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
          <h3>{this.props.t('registration.form.input.zip')}</h3>
          <Field component="input" name="zip" data-cy="input-zip" />
          <ErrorMessage
            name="zip"
            data-cy="input-error-zip"
            component="span"
            className={classes.ErrorMessage}
          />
        </div>
        <div className={classes.PostOffice}>
          <h3>{this.props.t('registration.form.input.postOffice')}</h3>
          <Field
            component="input"
            name="postOffice"
            data-cy="input-postOffice"
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
};

export default withTranslation()(ZipAndPostOffice);
