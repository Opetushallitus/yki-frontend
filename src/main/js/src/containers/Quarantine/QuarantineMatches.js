import moment from 'moment';
import React, { useEffect, useState } from 'react';
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
    closeConfirmQuarantine,
    confirm,
    error,
    loading,
  } = props;
  const findLang = language => LANGUAGES.find(l => l.code === language).name;
  const closeConfirmModal = () => closeConfirmQuarantine();
  const hasError = !R.isNil(error);

  useEffect(onFetchQuarantineMatches, [hasError]);

  const [quarantineDetails, setQuarantineDetails] = useState(null);
  useEffect(() => {
    if (confirm && confirm.quarantineId && confirm.registrationId) {
      setQuarantineDetails(
        matches.find(
          r =>
            r.id === confirm.quarantineId &&
            r.registration_id === confirm.registrationId,
        ),
      );
    } else {
      setQuarantineDetails(null);
    }
  }, [confirm, matches]);

  const showQuarantineConfirm = (id, reg_id) =>
    confirmQuarantine(reg_id, id, true);

  const doSetQuarantine = (id, reg_id, quarantined) =>
    setQuarantine(id, reg_id, quarantined);

  const isPastExamDate = match =>
    moment(match.exam_date).isBefore(moment(), 'day');

  return (
    <Page>
      {R.isNil(error) && !R.isNil(confirm) && !R.isNil(quarantineDetails) && (
        <QuarantineConfirmModal
          t={t}
          confirm={confirm.callback}
          cancel={closeConfirmModal}
          loading={loading}
          quarantineDetails={quarantineDetails}
          isQuarantined={confirm.quarantined}
        />
      )}
      <div className={classes.QuarantineMatches}>
        <h1>{t('participationBan.title')}</h1>

        <QuarantineNav t={t} />

        <p>{t('participationBan.matchesDescription')}</p>

        <div className={classes.QuarantineList}>
          <div className={classes.ListHeader} />
          <div className={classes.ListHeader}>{t('common.examLanguage')}</div>
          <div className={classes.ListHeader}>
            {t('participationBan.examDate')}
          </div>
          <div className={classes.ListHeader}>{t('common.names')}</div>
          <div className={classes.ListHeader}>{t('common.birthdate')}</div>
          <div className={classes.ListHeader}>{t('common.email')}</div>
          <div className={classes.ListHeader}>{t('common.phoneNumber')}</div>
          <div />
          <div />
          {matches.map(match => (
            <React.Fragment key={`quarantine-match-row-${match.id}`}>
              <div className={classes.IndicatorRow}>
                <span>{t('common.registree')}</span>
                <span>{t('common.participationBan')}</span>
              </div>
              <div>{findLang(match.language_code)}</div>
              <div>{moment(match.exam_date).format(DATE_FORMAT)}</div>
              <div className={classes.ListRow}>
                <span>
                  {match.form.first_name} {match.form.last_name}
                </span>
                <span>
                  {match.first_name} {match.last_name}
                </span>
              </div>
              <div className={classes.ListRow}>
                <span>{moment(match.form.birthdate).format(DATE_FORMAT)}</span>
                <span>{moment(match.birthdate).format(DATE_FORMAT)}</span>
              </div>
              <div className={classes.ListRow}>
                <span>{match.form.email}</span>
                <span>{match.email}</span>
              </div>
              <div className={classes.ListRow}>
                <span>{match.form.phone_number}</span>
                <span>{match.phone_number}</span>
              </div>
              <div
                data-cy="set-quarantine-btn"
                className={classes.PrimaryButton}
              >
                <Button
                  clicked={showQuarantineConfirm.bind(
                    this,
                    match.id,
                    match.registration_id,
                  )}
                >
                  {isPastExamDate(match)
                    ? t('participationBan.moveToHistory')
                    : t('participationBan.setBan')}
                </Button>
              </div>
              <div data-cy="set-no-quarantine-btn">
                <Button
                  clicked={doSetQuarantine.bind(
                    this,
                    match.id,
                    match.registration_id,
                    false,
                  )}
                >
                  {t('participationBan.acceptParticipation')}
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
    confirmQuarantine: (registrationId, quarantineId, quarantined) => {
      dispatch(
        actions.confirmQuarantine(
          () =>
            dispatch(
              actions.setQuarantine(quarantineId, registrationId, quarantined),
            ),
          registrationId,
          quarantineId,
          quarantined,
        ),
      );
    },
    closeConfirmQuarantine: () => {
      dispatch(actions.closeConfirmQuarantine());
    },
    errorConfirmedHandler: () => dispatch(actions.resetAll()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(withErrorHandler(QuarantineMatches)));
