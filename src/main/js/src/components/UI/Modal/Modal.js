import React from 'react';
import PropTypes from 'prop-types';

import classes from './Modal.module.css';
import Backdrop from '../Backdrop/Backdrop';

const modalClass = props => {
  if (props.confirmationModal) return classes.TinyModal;
  if (props.smallModal) return classes.SmallModal;
  return classes.Modal;
}

const modal = props => (
  <React.Fragment>
    <Backdrop show={props.show} clicked={props.modalClosed} />
    <div
      className={modalClass(props)}
      style={{
        display: props.show ? 'block' : 'none',
      }}
    >
      <button
        data-cy={props.show && "modal-close-button"}
        aria-label="Close"
        className={classes.ModalClose}
        onClick={props.modalClosed}
      />
      <div className={classes.Content}>{props.children}</div>
    </div>
  </React.Fragment>
);

modal.propTypes = {
  show: PropTypes.bool.isRequired,
  modalClosed: PropTypes.func.isRequired,
  children: PropTypes.any,
  smallModal: PropTypes.bool,
  confirmationModal: PropTypes.bool,
};

export default modal;
