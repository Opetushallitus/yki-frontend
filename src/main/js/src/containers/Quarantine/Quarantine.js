import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
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
    onEditQuarantine,
    onShowAddModal,
    showAddModal,
    onConfirmModal,
    confirm,
    onDeleteQuarantine,
  } = props;
  const findLang = (language) => LANGUAGES.find(l => l.code === language).name;
  const [endDate, setEndDate] = useState(null);
  const [birthdate, setBirthdate] = useState(null);
  const initialForm = {
    language_code: 'fin',
    email: '',
    phone_number: '',
    name: '',
    end_date: '',
    birthdate: '',
  };
  const today = moment(new Date()).format('YYYY-MM-DD');
  const onFormSubmit = (form, actions) => {
    const payload = {
      ...form,
      birthdate: birthdate ? dateToString(birthdate) : showAddModal.form.birthdate,
      end_date: endDate ? dateToString(endDate) :  showAddModal.form.end_date,
    };

    form.id
      ? onEditQuarantine(payload)
      : onAddNewQuarantine(payload);

    actions.resetForm(initialForm);
  };
  const cancelForm = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onShowAddModal(false);
  };
  const doDelete = (id) => {
    onConfirmModal(onDeleteQuarantine.bind(this, id));
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
      <p>Haluatko varmasti poistaa karenssin?</p>
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
      <div className={classes.ConfirmText}>
        Uusi karenssi
      </div>
      <Formik
        initialValues={showAddModal ? showAddModal.form : initialForm}
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
                  options={{
                    defaultDate: showAddModal.form.end_date,
                    value: endDate ? dateToString(endDate) : showAddModal.form.end_date,
                    minDate: today,
                  }}
                  locale={i18n.language}
                  onChange={(dates) => setEndDate(moment(dates[0]))}
                  id="end_date"
                />
              </div>

              <div className={classes.QuarantineFormField}>
                <label htmlFor="name">Etu- ja sukunimi</label>
                <Field id="name" name="name" />
              </div>

              <div className={classes.QuarantineFormField}>
                <label htmlFor="birthdate">Syntymäaika</label>
                <DatePicker
                  options={{
                    defaultDate: showAddModal.form.birthdate,
                    value: birthdate ? dateToString(birthdate) : showAddModal.form.birthdate,
                    maxDate: today,
                  }}
                  locale={i18n.language}
                  onChange={(dates) => setBirthdate(moment(dates[0]))}
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

            <div className={classes.ConfirmButtons}>
              <button className={classes.ConfirmButton} type="submit" tabIndex="4">
                Lähetä
              </button>
              <button className={classes.CancelButton} onClick={cancelForm} tabIndex="4">
                Peruuta
              </button>
            </div>
          </Form>
        )}/>
    </Modal>
  );

  return (
    <Page>
      {!R.isNil(showAddModal) && quarantineModal}
      {confirmDeleteModal}
      <div className={classes.Quarantines}>

        <h1>
          Karenssit
        </h1>

        <NavLink to="/karenssi/mahdolliset" className={classes.MenuItem} activeClassName={classes.Active}>
          Odottavat tarkistukset
        </NavLink>
        <NavLink to="/karenssi/historia" className={classes.MenuItem} activeClassName={classes.Active}>
          Aiemmat tarkistukset
        </NavLink>
        <NavLink to="/karenssi" className={classes.MenuItem} activeClassName={classes.Active}>
          Aktiiviset karenssit
        </NavLink>

        <div className={classes.PrimaryButton}>
          <Button clicked={onShowAddModal.bind(this, { isVisible: true, form: initialForm })}>
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
          {quarantines.map((quarantine) => (
            <React.Fragment key={`quarantine-row-${quarantine.id}`}>
              <div>{findLang(quarantine.language_code)}</div>
              <div>{moment(quarantine.end_date).format(DATE_FORMAT)}</div>
              <div>
                {quarantine.name}
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
                  Muokkaa
                </Button>
              </div>
              <div className={classes.DeleteButton}>
                <Button clicked={doDelete.bind(this, quarantine.id)}>
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(withErrorHandler(Quarantine)));
