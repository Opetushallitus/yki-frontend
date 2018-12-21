import React from 'react';
import PropTypes from 'prop-types';

import Modal from '../../components/UI/Modal/Modal';

const defaultKey = 'error.common';

const withErrorHandler = WrappedComponent => {
  const errorHandler = props => (
    <React.Fragment>
      <Modal show={!!props.error} modalClosed={props.errorConfirmedHandler}>
        {props.error
          ? props.error.key
            ? props.t(props.error.key)
            : props.t(defaultKey)
          : null}
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
