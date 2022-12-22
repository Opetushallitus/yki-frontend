import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import * as R from 'ramda';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import Button from '../../components/UI/Button/Button';
import DatePicker from '../../components/UI/DatePicker/DatePicker';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Page from '../../hoc/Page/Page';
import classes from './Quarantine.module.css';
import * as actions from '../../store/actions/index';
import { DATE_FORMAT, LANGUAGES } from '../../common/Constants';
import Modal from '../../components/UI/Modal/Modal';

const dateToString = date => date.format('YYYY-MM-DD');

const Quarantine = props => {
  const {
    t,
    i18n,
    quarantines,
    onFetchQuarantines,
    onAddNewQuarantine,
    onShowAddModal,
    showAddModal,
    onConfirmModal,
    confirm
  } = props;
  const findLang = (language) => LANGUAGES.find(l => l.code === language).name;
  const [endDate, setEndDate] = useState(null);
  const [birthdate, setBirthdate] = useState(null);
  const initialForm = {
    language_code: 'fin',
    email: '',
    phone_number: '',
    name: '',
  };
  const onFormSubmit = (form, actions) => {
    const payload = {
      ...form,
      birthdate: dateToString(birthdate),
      end_date: dateToString(endDate),
    };
    onAddNewQuarantine(payload);

    actions.resetForm(initialForm);
  };
  const cancelForm = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onShowAddModal(false)
  };
  const doDelete = (id) => {
    onConfirmModal(() => '');
  };

  useEffect(onFetchQuarantines, []);

  const closeConfirmModal = onConfirmModal.bind(this, null);
  const confirmDeleteModal = (
    <Modal
      show={!R.isNil(confirm)}
      confirmationModal
      modalClosed={closeConfirmModal}
    >
      <div className={classes.ConfirmText}>
        {t('common.areYouSure')}
      </div>
      <p>{t('quarantine.confirmDescription')}</p>
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
      show={showAddModal}
      smallModal
      modalClosed={onShowAddModal.bind(this, false)}>
      <Formik
        initialValues={initialForm}
        onSubmit={onFormSubmit}
        render={({ values, handleChange }) => (
          <Form>
            <div className={classes.QuarantineFormFields}>
              <div className={classes.QuarantineFormField}>
                <label htmlFor="language_code">Tutkinnon kieli</label>
                <select
                  value={values.language_code}
                  name="language_code"
                  onChange={handleChange}
                >
                  <option value="swe">Ruotsi</option>
                  <option value="fin">Suomi</option>
                </select>
              </div>

              <div className={classes.QuarantineFormField}>
                <label htmlFor="end_date">Vanhenee</label>
                <DatePicker
                  options={{ value: endDate ? dateToString(endDate) : '' }}
                  locale={i18n.language}
                  onChange={(dates) => {
                    setEndDate(moment(dates[0]));
                  }}
                  id="end_date"
                />
              </div>

              <div className={classes.QuarantineFormField}>
                <label htmlFor="first_name">Etu- ja sukunimi</label>
                <Field name="name" />
              </div>

              <div className={classes.QuarantineFormField}>
                <label htmlFor="birthdate">Syntymäaika</label>
                <DatePicker
                  options={{ value: birthdate ? dateToString(birthdate) : '' }}
                  locale={i18n.language}
                  onChange={(dates) => {
                    setBirthdate(moment(dates[0]));
                  }}
                  id="birthdate"
                />
              </div>

              <div className={classes.QuarantineFormField}>
                <label htmlFor="email">Email</label>
                <Field name="email" />
              </div>

              <div className={classes.QuarantineFormField}>
                <label htmlFor="phone_number">Puhelinnumero</label>
                <Field name="phone_number" />
              </div>
            </div>

            <Button clicked={cancelForm} tabIndex="4">
              Peruuta
            </Button>
            <Button type="submit" tabIndex="4">
              Lähetä
            </Button>
          </Form>
        )}/>
    </Modal>
  );

  return (
    <Page>
      {quarantineModal}
      {confirmDeleteModal}
      <div className={classes.Quarantines}>
        <h1>
          Karenssit
        </h1>

        <div className={classes.PrimaryButton}>
          <Button clicked={onShowAddModal.bind(this, true)}>
            Lisää karenssi
          </Button>
        </div>

        <div className={classes.QuarantineList}>
          <div className={classes.ListHeader}>
            {t('common.examLanguage')}
          </div>
          <div className={classes.ListHeader}>
            Vanhenee
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
          <div className={classes.ListHeader}>
          </div>
          <div className={classes.ListHeader}>
          </div>
          {quarantines.map((match) => (
            <React.Fragment key={`quarantine-row-${match.id}`}>
              <div>{findLang(match.language_code)}</div>
              <div>{moment(match.end_date).format(DATE_FORMAT)}</div>
              <div>
                {match.name}
              </div>
              <div>
                {match.email}
              </div>
              <div>
                {moment(match.birthdate).format(DATE_FORMAT)}
              </div>
              <div>
                {match.phone_number}
              </div>
              <div className={classes.EditButton}>
                <Button>
                  Muokkaa karenssia
                </Button>
              </div>
              <div className={classes.DeleteButton}>
                <Button clicked={doDelete.bind(this, match.id)}>
                  Poista
                </Button>
              </div>
            </React.Fragment>
          ))}
        </div>
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
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchQuarantines: () => {
      dispatch(actions.fetchQuarantines());
    },
    onAddNewQuarantine: (form) => {
      dispatch(actions.addNewQuarantine(form));
    },
    onShowAddModal: (isVisible) => {
      dispatch(actions.showAddModal(isVisible));
    },
    onConfirmModal: (callback) => {
      dispatch(actions.confirmQuarantine(callback));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(withErrorHandler(Quarantine)));
