import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import queryString from 'query-string';

import Alert from '../Alert/Alert';
import Page from '../../hoc/Page/Page';

const status = props => {
  const queryParams = queryString.parse(props.location.search);
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
    <Page withoutNavigation={true}>
      <div>{status(props)}</div>
    </Page>
  );
};

paymentStatus.propTypes = {
  location: PropTypes.object.isRequired,
};

export default withNamespaces()(paymentStatus);
