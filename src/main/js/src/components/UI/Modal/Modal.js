import React from 'react';
import PropTypes from 'prop-types';

import classes from './Modal.module.css';
import Backdrop from '../Backdrop/Backdrop';

const modal = props => (
  <React.Fragment>
    <Backdrop show={props.show} clicked={props.modalClosed} />
    <div
      className={props.smallModal ? classes.SmallModal : classes.Modal}
      style={{
        display: props.show ? 'block' : 'none',
      }}
    >
      <button
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
  smallModal: PropTypes.bool
};

export default modal;
