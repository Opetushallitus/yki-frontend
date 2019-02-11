import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import queryString from 'query-string';

import Alert from '../Alert/Alert';
import Page from '../../hoc/Page/Page';

import classes from './PaymentStatus.module.css';


const status = props => {
  const queryParams = queryString.parse(props.location.search);

  const paymentSuccess = (
    <div className={classes.PaymentStatus}>
      <div>
        <h1 data-cy="registration-success-header">
          {props.t('payment.status.success')}
        </h1>
        <p>{props.t('registration.success.info1')}:</p>
      </div>
      <div>
        <p>
          {props.t('registration.success.info2')}
        </p>
      </div>
      <div className={classes.InfoBox}>
        <p>
          <b>{props.t('registration.success.info3')}</b>{' '}
          {props.t('registration.success.info4')}
        </p>
      </div>
    </div>
  );

  switch (queryParams.status) {
    case 'payment-success': {
      return <Alert title={props.t('payment.status.success')} success={true} />;
    }
    case 'payment-cancel': {
      return <Alert title={props.t('payment.status.cancel')} success={true} />;
    }
    default: {
      return <Alert title={props.t('payment.status.error')} success={false} />;
    }
  }
};

export const paymentStatus = props => {
  return (
    <Page>
      <div>{status(props)}</div>
    </Page>
  );
};

paymentStatus.propTypes = {
  location: PropTypes.object.isRequired,
};

export default withNamespaces()(paymentStatus);
