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

const QuarantineMatches = props => {
  const {
    t,
    matches,
    onFetchQuarantineMatches,
    setQuarantine,
    confirmQuarantine,
    confirm,
    error
  } = props;
  const findLang = (language) => LANGUAGES.find(l => l.code === language).name;
  const closeConfirmModal = () => confirmQuarantine(null);

  const confirmQuarantineModal = (
    <Modal
      show={!R.isNil(confirm) && R.isNil(error)}
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

  useEffect(onFetchQuarantineMatches, []);

  const showQuarantineConfirm = (id, reg_id) =>
    confirmQuarantine(() => setQuarantine(id, reg_id, true));

  const doSetQuarantine = (id, reg_id, quarantined) =>
    setQuarantine(id, reg_id, quarantined);

  return (
    <Page>
      {confirmQuarantineModal}
      <div className={classes.QuarantineMatches}>
        <h1>
          {t('quarantine.matchesTitle')}
        </h1>

        <p>
          {t('quarantine.matchesDescription')}
        </p>

        <div className={classes.QuarantineList}>
          <div className={classes.ListHeader}>
            {t('common.examLanguage')}
          </div>
          <div className={classes.ListHeader}>
            {t('common.examDate')}
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
          {matches.map((match) => (
            <React.Fragment key={`quarantine-match-row-{match.id}`}>
                <div>{findLang(match.language_code)}</div>
                <div>{moment(match.exam_date).format(DATE_FORMAT)}</div>
                <div>
                  {match.name}<br />
                  {match.form.first_name} {match.form.last_name}
                </div>
                <div>
                  {match.email}<br />
                  {match.form.email}
                </div>
                <div>
                  {moment(match.birthdate).format(DATE_FORMAT)}
                  <br />
                  {moment(match.form.birthdate).format(DATE_FORMAT)}
                </div>
                <div>
                  {match.phone_number}<br />
                  {match.form.phone_number}
                </div>
                <div className={classes.PrimaryButton}>
                  <Button clicked={showQuarantineConfirm.bind(this, match.id, match.registration_id)}>
                    {t('quarantine.addQuarantine')}
                  </Button>
                </div>
                <div>
                  <Button clicked={doSetQuarantine.bind(this, match.id, match.registration_id, false)}>
                    {t('quarantine.noQuarantine')}
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
    matches: state.quarantine.matches,
    confirm: state.quarantine.confirm,
    error: state.quarantine.error,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchQuarantineMatches: () => {
      dispatch(actions.fetchQuarantineMatches());
    },
    setQuarantine: (id, reg_id, quarantined) => {
      dispatch(actions.setQuarantine(id, reg_id, quarantined));
    },
    confirmQuarantine: (callback) => {
      dispatch(actions.confirmQuarantine(callback));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(withErrorHandler(QuarantineMatches)));
