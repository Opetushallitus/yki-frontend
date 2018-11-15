import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classes from './Modal.module.css';
import Backdrop from '../Backdrop/Backdrop';

class Modal extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.show !== this.props.show ||
      nextProps.children !== this.props.children
    );
  }

  render() {
    return (
      <React.Fragment>
        <Backdrop show={this.props.show} clicked={this.props.modalClosed} />
        <div
          className={classes.Modal}
          style={{
            display: this.props.show ? 'block' : 'none',
          }}
        >
          {this.props.children}
        </div>
      </React.Fragment>
    );
  }
}

Modal.propTypes = {
  show: PropTypes.bool,
  children: PropTypes.any,
  modalClosed: PropTypes.func,
};

export default Modal;
