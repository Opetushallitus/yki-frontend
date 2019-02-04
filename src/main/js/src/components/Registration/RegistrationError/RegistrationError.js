import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';

import Alert from '../../Alert/Alert';

export const registrationError = props => {
  const resolveErrorMessage = () => {
    const error = props.error;
    let errorMsg = props.t('registration.init.error.generic');
    if (error.data && error.data.error) {
      if (error.data.error.full) {
        errorMsg = props.t('registration.init.error.session.full');
      } else if (error.data.error.closed) {
        errorMsg = props.t('registration.init.error.session.closed');
      } else if (error.data.error.registered) {
        errorMsg = props.t('registration.init.error.session.multiple');
      }
    }
    return errorMsg;
  };

  return (
    <Alert title={resolveErrorMessage()} />
  );
};

registrationError.propTypes = {
  error: PropTypes.object.isRequired,
};

export default withNamespaces()(registrationError);
