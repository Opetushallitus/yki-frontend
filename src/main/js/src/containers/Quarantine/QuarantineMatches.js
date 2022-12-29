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
import Spinner from '../../components/UI/Spinner/Spinner';
import QuarantineNav from '../../components/Quarantine/Navigation';
import QuarantineConfirmModal from '../../components/Quarantine/ConfirmModal';

const QuarantineMatches = props => {
  const {
    t,
    matches,
    onFetchQuarantineMatches,
    setQuarantine,
    confirmQuarantine,
    confirm,
    error,
    loading,
  } = props;
  const findLang = (language) => LANGUAGES.find(l => l.code === language).name;
  const closeConfirmModal = () => confirmQuarantine(null);
  const hasError = !R.isNil(error);

  useEffect(onFetchQuarantineMatches, [hasError]);

  const showQuarantineConfirm = (id, reg_id) =>
    confirmQuarantine(() => setQuarantine(id, reg_id, true));

  const doSetQuarantine = (id, reg_id, quarantined) =>
    setQuarantine(id, reg_id, quarantined);

  return (
    <Page>
      {R.isNil(error) && !R.isNil(confirm) && (
        <QuarantineConfirmModal
          t={t}
          confirm={confirm}
          cancel={closeConfirmModal}
        />
      )}
      <div className={classes.QuarantineMatches}>
        <h1>
          {t('quarantine.matchesTitle')}
        </h1>

        <QuarantineNav />

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
            <React.Fragment key={`quarantine-match-row-${match.id}`}>
                <div>{findLang(match.language_code)}</div>
                <div>{moment(match.exam_date).format(DATE_FORMAT)}</div>
                <div>
                  {match.first_name} {match.last_name}<br />
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
    matches: state.quarantine.matches,
    confirm: state.quarantine.confirm,
    error: state.quarantine.error,
    loading: state.quarantine.loading,
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
    errorConfirmedHandler: () => dispatch(actions.resetAll()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(withErrorHandler(QuarantineMatches)));
