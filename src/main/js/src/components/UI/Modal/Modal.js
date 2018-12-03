import React from 'react';
import PropTypes from 'prop-types';

import classes from './Modal.module.css';
import Backdrop from '../Backdrop/Backdrop';

const modal = props => (
  <React.Fragment>
    <Backdrop show={props.show} clicked={props.modalClosed} />
    <div
      className={classes.Modal}
      style={{
        display: props.show ? 'block' : 'none',
      }}
    >
      <button
        aria-label="Close"
        className={classes.ModalClose}
        onClick={props.modalClosed}
      />
      {props.children}
    </div>
  </React.Fragment>
);

modal.propTypes = {
  show: PropTypes.bool,
  children: PropTypes.any,
  modalClosed: PropTypes.func,
};

export default modal;
