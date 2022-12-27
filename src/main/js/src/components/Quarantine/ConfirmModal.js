import * as R from 'ramda';
import React from 'react';
import classes from './Quarantine.module.css';
import Modal from '../../components/UI/Modal/Modal';
import PropTypes from 'prop-types';

const QuarantineConfirmModal = props => {
  return (
    <Modal
      show={!R.isNil(props.confirm)}
      confirmationModal
      modalClosed={props.cancel}
    >
      <div className={classes.ConfirmText}>
        {props.t('common.areYouSure')}
      </div>
      <p>{props.t('quarantine.confirmDescription')}</p>
      <div className={classes.ConfirmButtons}>
        <button onClick={props.confirm} className={classes.ConfirmButton}>
          {props.t('common.confirm')}
        </button>
        <button onClick={props.cancel} className={classes.CancelButton}>
          {props.t('common.cancelConfirm')}
        </button>
      </div>
    </Modal>
  );
};

QuarantineConfirmModal.propTypes = {
  t: PropTypes.object.isRequired,
  confirm: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
};

export default QuarantineConfirmModal;
