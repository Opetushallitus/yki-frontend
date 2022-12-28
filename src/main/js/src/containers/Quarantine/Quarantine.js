import moment from 'moment';
import React, { useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import * as R from 'ramda';

import Button from '../../components/UI/Button/Button';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Page from '../../hoc/Page/Page';
import classes from './Quarantine.module.css';
import * as actions from '../../store/actions/index';
import { DATE_FORMAT, LANGUAGES } from '../../common/Constants';
import Modal from '../../components/UI/Modal/Modal';
import Spinner from '../../components/UI/Spinner/Spinner';
import SpinnerOverlay from '../../components/UI/SpinnerOverlay/SpinnerOverlay';
import QuarantineNav from '../../components/Quarantine/Navigation';
import QuarantineForm from '../../components/Quarantine/Form';

const initialForm = {
  language_code: 'fin',
  email: '',
  phone_number: '',
  first_name: '',
  last_name: '',
  end_date: '',
  birthdate: '',
};

const Quarantine = props => {
  const {
    t,
    i18n,
    quarantines,
    onFetchQuarantines,
    onAddNewQuarantine,
    onEditQuarantine,
    onShowAddModal,
    showAddModal,
    onConfirmModal,
    confirm,
    onDeleteQuarantine,
    loading,
    error,
  } = props;
  const findLang = (language) => LANGUAGES.find(l => l.code === language).name;
  const doDelete = (id) => {
    onConfirmModal(onDeleteQuarantine.bind(this, id));
  };

  useEffect(onFetchQuarantines, [error]);

  const closeConfirmModal = onConfirmModal.bind(this, null);
  const confirmDeleteModal = (
    <Modal
      show={!R.isNil(confirm)}
      confirmationModal
      modalClosed={closeConfirmModal}
    >
      {loading && (<SpinnerOverlay />)}
      <div className={classes.ConfirmText}>
        {t('common.areYouSure')}
      </div>
      <p>{t('quarantine.askDelete')}</p>
      <div className={classes.ConfirmButtons}>
        <button onClick={confirm} className={classes.ConfirmButton}>
          {t('common.confirm')}
        </button>
        <button onClick={closeConfirmModal} className={classes.CancelButton}>
          {t('common.cancelConfirm')}
        </button>
      </div>
    </Modal>
  );

  const quarantineModal = (
    <Modal
      show={!R.isNil(showAddModal)}
      smallModal
      modalClosed={onShowAddModal.bind(this, null)}
      className={classes.QuarantineModal}
    >
      {loading && (<SpinnerOverlay />)}
      <div className={classes.ConfirmText}>
        {t('quarantine.new')}
      </div>
      <QuarantineForm
        t={t}
        i18n={i18n}
        form={showAddModal ? showAddModal.form : initialForm}
        onEdit={onEditQuarantine}
        onAdd={onAddNewQuarantine}
        onCancel={() => onShowAddModal(null)}
      />
    </Modal>
  );

  return (
    <Page>
      {R.isNil(error) && !R.isNil(showAddModal) && quarantineModal}
      {R.isNil(error) && confirmDeleteModal}
      <div className={classes.Quarantines}>
        <h1>
          {t('quarantine.quarantines')}
        </h1>

        <QuarantineNav />

        <div className={classes.PrimaryButton}>
          <Button clicked={onShowAddModal.bind(this, { isVisible: true, form: initialForm })}>
            {t('quarantine.addQuarantine')}
          </Button>
        </div>

        <div className={classes.QuarantineList}>
          <div className={classes.ListHeader}>
            {t('common.expires')}
          </div>
          <div className={classes.ListHeader}>
            {t('common.examLanguage')}
          </div>
          <div className={classes.ListHeader}>
            {t('common.names')}
          </div>
          <div className={classes.ListHeader}>
            {t('common.email')}
          </div>
          <div className={classes.ListHeader}>
            {t('common.birthdate')}
          </div>
          <div className={classes.ListHeader}>
            {t('common.phoneNumber')}
          </div>
          <div/>
          <div/>
          {quarantines.map((quarantine) => (
            <React.Fragment key={`quarantine-row-${quarantine.id}`}>
              <div>{moment(quarantine.end_date).format(DATE_FORMAT)}</div>
              <div>{findLang(quarantine.language_code)}</div>
              <div>
                {quarantine.first_name} {quarantine.last_name}
              </div>
              <div>
                {quarantine.email}
              </div>
              <div>
                {moment(quarantine.birthdate).format(DATE_FORMAT)}
              </div>
              <div>
                {quarantine.phone_number}
              </div>
              <div className={classes.EditButton}>
                <Button clicked={onShowAddModal.bind(this, { isVisible: true, form: quarantine })}>
                  {t('common.edit')}
                </Button>
              </div>
              <div className={classes.DeleteButton}>
                <Button clicked={doDelete.bind(this, quarantine.id)}>
                  {t('common.delete')}
                </Button>
              </div>
            </React.Fragment>
          ))}
        </div>
        {loading && (
          <div className={classes.SpinnerContainer}>
            <Spinner />
          </div>
        )}
     </div>
    </Page>
  );
};

const mapStateToProps = state => {
  return {
    quarantines: state.quarantine.quarantines,
    showAddModal: state.quarantine.showAddModal,
    error: state.quarantine.error,
    confirm: state.quarantine.confirm,
    loading: state.quarantine.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onDeleteQuarantine: (id) => {
      dispatch(actions.deleteQuarantine(id));
    },
    onFetchQuarantines: () => {
      dispatch(actions.fetchQuarantines());
    },
    onAddNewQuarantine: (form) => {
      dispatch(actions.addNewQuarantine(form));
    },
    onEditQuarantine: (form) => {
      dispatch(actions.editQuarantine(form));
    },
    onShowAddModal: (isVisible) => {
      dispatch(actions.showAddModal(isVisible));
    },
    onConfirmModal: (callback) => {
      dispatch(actions.confirmQuarantine(callback));
    },
    errorConfirmedHandler: () => dispatch(actions.resetAll()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(withErrorHandler(Quarantine)));
