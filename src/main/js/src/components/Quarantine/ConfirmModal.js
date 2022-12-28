import * as R from 'ramda';
import React from 'react';
import classes from './Quarantine.module.css';
import Modal from '../../components/UI/Modal/Modal';
import PropTypes from 'prop-types';

const QuarantineConfirmModal = props => {
  const {
    t,
    confirm,
    cancel,
  } = props;

  return (
    <Modal
      show={!R.isNil(confirm)}
      confirmationModal
      modalClosed={cancel}
    >
      <div className={classes.ConfirmText}>
        {t('common.areYouSure')}
      </div>
      <p>{t('quarantine.confirmDescription')}</p>
      <div className={classes.ConfirmButtons}>
        <button onClick={confirm} className={classes.ConfirmButton}>
          {t('common.confirm')}
        </button>
        <button onClick={cancel} className={classes.CancelButton}>
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
};

export default QuarantineConfirmModal;
