import React from 'react';
import PropTypes from 'prop-types';

import Modal from '../../components/UI/Modal/Modal';
import Alert from '../../components/Alert/Alert';
import * as i18nKeys from "../../common/LocalizationKeys";

const defaultKey = i18nKeys.error_common;

const withErrorHandler = WrappedComponent => {
  const errorHandler = props => (
    <React.Fragment>
      <Modal show={!!props.error} modalClosed={props.errorConfirmedHandler}>
        {!!props.error ? (
          <React.Fragment>
            <Alert
              title={
                props.error.key ? props.t(props.error.key) : props.t(defaultKey)
              }
            />
            <p>{props.t(i18nKeys.error_generic_info)}</p>
          </React.Fragment>
        ) : null}
      </Modal>
      <WrappedComponent {...props} />
    </React.Fragment>
  );

  errorHandler.propTypes = {
    errorConfirmedHandler: PropTypes.func.isRequired,
    error: PropTypes.object,
    t: PropTypes.func.isRequired,
  };

  return errorHandler;
};

export default withErrorHandler;
