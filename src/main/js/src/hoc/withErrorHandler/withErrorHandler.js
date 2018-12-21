import React, { Component } from 'react';

import Modal from '../../components/UI/Modal/Modal';

const defaultKey = 'error.common';

const withErrorHandler = WrappedComponent => {
  return class withErrorHandler extends Component {
    render() {
      return (
        <React.Fragment>
          <Modal
            show={!!this.props.error}
            modalClosed={this.props.errorConfirmedHandler}
          >
            {this.props.error
              ? this.props.error.key
                ? this.props.t(this.props.error.key)
                : this.props.t(defaultKey)
              : null}
          </Modal>
          <WrappedComponent {...this.props} />
        </React.Fragment>
      );
    }
  };
};

export default withErrorHandler;
