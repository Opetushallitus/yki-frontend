import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import Alert from '../../Alert/Alert';
import * as i18nKeys from "../../../common/LocalizationKeys";

export const registrationError = props => {
  const resolveErrorMessage = () => {
    const error = props.error;
    console.log('real error: ', error);
    let errorKey = props.defaultKey;
    if (error.data && error.data.error) {
      if (error.data.error.full) {
        errorKey = i18nKeys.registration_init_error_session_full;
      } else if (error.data.error.closed) {
        errorKey = i18nKeys.registration_init_error_session_closed;
      } else if (error.data.error.registered) {
        errorKey = i18nKeys.registration_init_error_session_multiple;
      } else if (error.data.error.expired) {
        errorKey = i18nKeys.registration_error_form_expired;
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
