import moment from 'moment';
import * as R from 'ramda';
import React from 'react';

import classes from './Quarantine.module.css';
import { DATE_FORMAT, LANGUAGES } from '../../common/Constants';
import Modal from '../../components/UI/Modal/Modal';
import PropTypes from 'prop-types';
import SpinnerOverlay from '../../components/UI/SpinnerOverlay/SpinnerOverlay';

const QuarantineDetails = ({ quarantine, t }) => {
  const { exam_date, form, language_code, state } = quarantine;
  const examLanguage = LANGUAGES.find(({ code }) => code === language_code)
    .name;

  return (
    <div className={classes.QuarantineDetails}>
      <div>
        <div>{t('common.exam')}:</div>
        <div>{t('common.name')}:</div>
        <div>{t('common.birthdate')}:</div>
        <div>{t('participationBan.paymentState')}:</div>
      </div>
      <div className={classes.ColumnBold}>
        <div>
          {examLanguage}, {moment(exam_date).format(DATE_FORMAT)}
        </div>
        <div>
          {form.last_name}, {form.first_name}
        </div>
        <div>{moment(form.birthdate).format(DATE_FORMAT)}</div>
        <div>
          {state === 'COMPLETED' || state === 'PAID_AND_CANCELLED'
            ? t('participationBan.paymentState.paid')
            : t('participationBan.paymentState.notPaid')}
        </div>
      </div>
    </div>
  );
};

const QuarantineConfirmModal = props => {
  const {
    t,
    confirm,
    cancel,
    loading,
    quarantineDetails,
    isQuarantined,
  } = props;

  return (
    <Modal
      show={!R.isNil(confirm)}
      confirmationModal
      modalClosed={cancel}
      className={classes.ConfirmModal}
    >
      {loading && <SpinnerOverlay />}
      <h3 className={classes.ConfirmText}>{t('common.areYouSure')}</h3>
      <p>
        {isQuarantined
          ? t('participationBan.dialog.confirm.description')
          : t('participationBan.dialog.return.description')}
      </p>
      <QuarantineDetails quarantine={quarantineDetails} t={t} />
      <p>
        {isQuarantined
          ? moment(quarantineDetails.exam_date).isBefore(moment(), 'day')
            ? t('participationBan.dialog.confirm.pastExam')
            : t('participationBan.dialog.confirm.note')
          : t('participationBan.dialog.return.note')}
      </p>
      <div className={classes.ConfirmButtons}>
        <button
          data-cy="confirm-set-quarantine-btn"
          onClick={confirm}
          className={classes.ConfirmButton}
        >
          {t('common.confirm')}
        </button>
        <button
          data-cy="cancel-set-quarantine-btn"
          onClick={cancel}
          className={classes.CancelButton}
        >
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
  quarantineDetails: PropTypes.object.isRequired,
  isQuarantined: PropTypes.bool.isRequired,
};

export default QuarantineConfirmModal;
