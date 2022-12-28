import React from 'react';
import PropTypes from 'prop-types';

import classes from './Modal.module.css';
import Backdrop from '../Backdrop/Backdrop';

const modalClass = props => {
  const className = props.className ? props.className : '';

  if (props.confirmationModal) return [className, classes.TinyModal].join(' ');
  if (props.smallModal) return [className, classes.SmallModal].join(' ');
  return [className, classes.Modal].join(' ');
}

const modal = props => (
  <React.Fragment>
    <Backdrop show={props.show} clicked={props.modalClosed} />
    <div
      disabled={true}
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
  className: PropTypes.string,
  smallModal: PropTypes.bool,
  confirmationModal: PropTypes.bool,
};

export default modal;
