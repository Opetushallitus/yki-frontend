import * as R from 'ramda';
import React from 'react';
import classes from './Quarantine.module.css';
import Modal from '../../components/UI/Modal/Modal';
import PropTypes from 'prop-types';
import SpinnerOverlay from '../../components/UI/SpinnerOverlay/SpinnerOverlay';

const QuarantineConfirmModal = props => {
  const {
    t,
    confirm,
    cancel,
    loading,
    description,
  } = props;

  return (
    <Modal
      show={!R.isNil(confirm)}
      confirmationModal
      modalClosed={cancel}
      className={classes.ConfirmModal}
    >
      {loading && (<SpinnerOverlay />)}
      <div className={classes.ConfirmText}>
        {t('common.areYouSure')}
      </div>
      <p>{description}</p>
      <div className={classes.ConfirmButtons}>
        <button
          data-cy="confirm-set-quarantine-btn"
          onClick={confirm}
          className={classes.ConfirmButton}>
          {t('common.confirm')}
        </button>
        <button
          data-cy="cancel-set-quarantine-btn"
          onClick={cancel}
          className={classes.CancelButton}>
          {t('common.cancelConfirm')}
        </button>
      </div>
    </Modal>
  );
};

QuarantineConfirmModal.propTypes = {
  t: PropTypes.func.isRequired,
  confirm: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  description: PropTypes.bool.isRequired,
};

export default QuarantineConfirmModal;
