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
  start_date: '',
  end_date: '',
  birthdate: '',
  diary_number: '',
  ssn: '',
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
    closeConfirmModal,
    confirm,
    onDeleteQuarantine,
    loading,
    error,
  } = props;
  const findLang = language => LANGUAGES.find(l => l.code === language).name;
  const doDelete = id => {
    onConfirmModal(onDeleteQuarantine.bind(this, id));
  };
  const hasError = !R.isNil(error);

  useEffect(onFetchQuarantines, [hasError]);
  const sortQuarantines = R.sortWith([
    R.descend(R.prop('end_date')),
    R.ascend(R.prop('last_name')),
    R.ascend(R.prop('first_name')),
  ]);

  const confirmDeleteModal = (
    <Modal
      show={!R.isNil(confirm)}
      confirmationModal
      modalClosed={closeConfirmModal}
    >
      {loading && <SpinnerOverlay />}
      <h3 className={classes.ConfirmText}>{t('common.areYouSure')}</h3>
      <p>{t('participationBan.askDelete')}</p>
      <div className={classes.ConfirmButtons}>
        <button
          data-cy="confirm-delete-quarantine-btn"
          onClick={confirm && confirm.callback}
          className={classes.ConfirmButton}
        >
          {t('common.confirm')}
        </button>
        <button
          data-cy="cancel-delete-quarantine-btn"
          onClick={closeConfirmModal}
          className={classes.CancelButton}
        >
          {t('common.cancelConfirm')}
        </button>
      </div>
    </Modal>
  );

  const quarantineModal = () => {
    const form = showAddModal ? showAddModal.form : initialForm;
    const isNewQuarantine = form === initialForm;

    return (
      <Modal
        show={!R.isNil(showAddModal)}
        smallModal
        modalClosed={onShowAddModal.bind(this, null)}
        className={classes.QuarantineModal}
      >
        {loading && <SpinnerOverlay />}
        <h2 className={classes.ConfirmText}>
          {isNewQuarantine
            ? t('participationBan.new')
            : t('participationBan.edit')}
        </h2>
        <QuarantineForm
          t={t}
          i18n={i18n}
          form={form}
          onEdit={onEditQuarantine}
          onAdd={onAddNewQuarantine}
          onCancel={() => onShowAddModal(null)}
        />
      </Modal>
    );
  };

  return (
    <Page>
      {R.isNil(error) && !R.isNil(showAddModal) && quarantineModal()}
      {R.isNil(error) && !R.isNil(confirm) && confirmDeleteModal}
      <div className={classes.Quarantines}>
        <h1>{t('participationBan.title')}</h1>

        <QuarantineNav t={t} />

        <div data-cy="add-quarantine-btn" className={classes.PrimaryButton}>
          <Button
            clicked={onShowAddModal.bind(this, {
              isVisible: true,
              form: initialForm,
            })}
          >
            {t('participationBan.addBan')}
          </Button>
        </div>

        <div
          className={`${classes.QuarantineList} ${classes.SavedQuarantinesList}`}
        >
          <div className={classes.ListHeader}>
            {t('participationBan.periodValid')}
          </div>
          <div className={classes.ListHeader}>{t('common.examLanguage')}</div>
          <div className={classes.ListHeader}>{t('common.names')}</div>
          <div className={classes.ListHeader}>{t('common.birthdate')}</div>
          <div className={classes.ListHeader}>{t('common.ssn')}</div>
          <div className={classes.ListHeader}>{t('common.email')}</div>
          <div className={classes.ListHeader}>{t('common.phoneNumber')}</div>
          <div />
          <div />
          {sortQuarantines(quarantines).map(quarantine => (
            <React.Fragment key={`quarantine-row-${quarantine.id}`}>
              <div>
                {moment(quarantine.start_date).format(DATE_FORMAT)} -{' '}
                {moment(quarantine.end_date).format(DATE_FORMAT)}
              </div>
              <div>{findLang(quarantine.language_code)}</div>
              <div>
                {quarantine.first_name} {quarantine.last_name}
              </div>
              <div>{moment(quarantine.birthdate).format(DATE_FORMAT)}</div>
              <div>{quarantine.ssn}</div>
              <div>{quarantine.email}</div>
              <div>{quarantine.phone_number}</div>
              <div data-cy="edit-quarantine-btn" className={classes.EditButton}>
                <Button
                  clicked={onShowAddModal.bind(this, {
                    isVisible: true,
                    form: quarantine,
                  })}
                >
                  {t('common.edit')}
                </Button>
              </div>
              <div
                data-cy="delete-quarantine-btn"
                className={classes.DeleteButton}
              >
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
    loading: state.quarantine.loading,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onDeleteQuarantine: id => {
      dispatch(actions.deleteQuarantine(id));
    },
    onFetchQuarantines: () => {
      dispatch(actions.fetchQuarantines());
    },
    onAddNewQuarantine: form => {
      dispatch(actions.addNewQuarantine(form));
    },
    onEditQuarantine: form => {
      dispatch(actions.editQuarantine(form));
    },
    onShowAddModal: isVisible => {
      dispatch(actions.showAddModal(isVisible));
    },
    onConfirmModal: callback => {
      dispatch(actions.confirmQuarantine(callback));
    },
    closeConfirmModal: () => {
      dispatch(actions.closeConfirmQuarantine());
    },
    errorConfirmedHandler: () => dispatch(actions.resetAll()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(withErrorHandler(Quarantine)));
