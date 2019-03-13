import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import Alert from '../../Alert/Alert';

export const registrationError = props => {
  const resolveErrorMessage = () => {
    const error = props.error;
    let errorKey = props.defaultKey;
    if (error.data && error.data.error) {
      if (error.data.error.full) {
        errorKey = 'registration.init.error.session.full';
      } else if (error.data.error.closed) {
        errorKey = 'registration.init.error.session.closed';
      } else if (error.data.error.registered) {
        errorKey = 'registration.init.error.session.multiple';
      } else if (error.data.error.expired) {
        errorKey = 'registration.error.form.expired';
      }
    }
    return props.t(errorKey);
  };

  return <Alert title={resolveErrorMessage()} />;
};

registrationError.propTypes = {
  error: PropTypes.object.isRequired,
  defaultKey: PropTypes.string.isRequired,
};

export default withTranslation()(registrationError);
