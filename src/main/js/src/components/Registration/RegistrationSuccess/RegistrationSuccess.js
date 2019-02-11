import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';

import classes from './RegistrationSuccess.module.css';
import Hyperlink from '../../UI/Hyperlink/Hyperlink';

export const registrationSuccess = props => {
  return (
    <div className={classes.RegistrationSuccess}>
      <div>
        <h1 data-cy="registration-success-header">
          {props.t('registration.success.header')}
        </h1>
        <p>{props.t('registration.success.info1')}:</p>
      </div>
      <div>
        <p>
          {props.t('registration.success.info2')} {props.formData.email}
        </p>
      </div>
      <div className={classes.InfoBox}>
        <p>
          <b>{props.t('registration.success.info3')}</b>{' '}
          {props.t('registration.success.info4')}
        </p>
      </div>
      <div className={classes.BackButton}>
        <Hyperlink to={'/yki/'} text={props.t('errorBoundary.return')} />
      </div>
    </div>
  );
};

registrationSuccess.propTypes = {
  initData: PropTypes.object.isRequired,
  formData: PropTypes.object.isRequired,
};

export default withNamespaces()(registrationSuccess);
