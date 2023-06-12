import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Trans, withTranslation } from 'react-i18next';
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

const QuarantineHistory = props => {
  const {
    t,
    reviews,
    onFetchQuarantineReviews,
    confirmQuarantine,
    closeConfirmQuarantine,
    confirm,
    loading,
    error,
  } = props;
  const findLang = language => LANGUAGES.find(l => l.code === language).name;
  const closeConfirmModal = () => closeConfirmQuarantine();
  const hasError = !R.isNil(error);

  const [quarantineDetails, setQuarantineDetails] = useState(null);
  useEffect(() => {
    if (confirm && confirm.quarantineId && confirm.registrationId) {
      setQuarantineDetails(
        reviews.find(
          r =>
            r.quarantine_id === confirm.quarantineId &&
            r.registration_id === confirm.registrationId,
        ),
      );
    } else {
      setQuarantineDetails(null);
    }
  }, [confirm, reviews]);

  useEffect(onFetchQuarantineReviews, [hasError]);

  const showQuarantineConfirm = (id, reg_id) =>
    confirmQuarantine(reg_id, id, true);

  const showCancelQuarantineConfirm = (id, reg_id) =>
    confirmQuarantine(reg_id, id, false);

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

        <p>{t('participationBan.reviewsDescription.line1')}</p>
        <p>
          <Trans
            t={t}
            i18nKey={'participationBan.reviewsDescription.line2'}
            values={{ col: t('participationBan.status') }}
            components={[<strong />]}
          />
        </p>
        <p>
          <Trans
            t={t}
            i18nKey={'participationBan.reviewsDescription.line3'}
            values={{
              setBan: t('participationBan.setBan'),
              returnParticipation: t('participationBan.returnParticipation'),
            }}
            components={[<strong />, <strong />]}
          />
        </p>

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
          <div className={classes.ListHeader}>
            {t('participationBan.status')}
          </div>
          <div />
          {reviews.map(review => (
            <React.Fragment
              key={`quarantine-match-row-${review.quarantine_id}`}
            >
              <div className={classes.IndicatorRow}>
                <span>{t('common.registree')}</span>
                <span>{t('common.participationBan')}</span>
              </div>
              <div>{findLang(review.language_code)}</div>
              <div>{moment(review.exam_date).format(DATE_FORMAT)}</div>
              <div className={classes.ListRow}>
                <span>
                  {review.form.first_name} {review.form.last_name}
                </span>
                <span>
                  {review.first_name} {review.last_name}
                </span>
              </div>
              <div className={classes.ListRow}>
                <span>{moment(review.form.birthdate).format(DATE_FORMAT)}</span>
                <span>{moment(review.birthdate).format(DATE_FORMAT)}</span>
              </div>
              <div className={classes.ListRow}>
                <span>{review.form.email}</span>
                <span>{review.email}</span>
              </div>
              <div className={classes.ListRow}>
                <span>{review.form.phone_number}</span>
                <span>{review.phone_number}</span>
              </div>
              <div className={classes.ListRow}>
                {review.is_quarantined
                  ? moment(review.updated).isBefore(review.exam_date, 'day')
                    ? t('participationBan.banned')
                    : t('participationBan.bannedLate')
                  : t('participationBan.notBanned')}
              </div>
              {moment().isBefore(review.exam_date, 'day') ? (
                <div
                  data-cy={`${
                    review.is_quarantined ? 'unset' : 'set'
                  }-quarantine-btn`}
                  className={
                    !review.is_quarantined
                      ? classes.PrimaryButton
                      : classes.DeleteButton
                  }
                >
                  {review.is_quarantined ? (
                    <Button
                      disabled={loading}
                      clicked={showCancelQuarantineConfirm.bind(
                        this,
                        review.quarantine_id,
                        review.registration_id,
                      )}
                    >
                      {t('participationBan.returnParticipation')}
                    </Button>
                  ) : (
                    <Button
                      disabled={loading}
                      clicked={showQuarantineConfirm.bind(
                        this,
                        review.quarantine_id,
                        review.registration_id,
                      )}
                    >
                      {t('participationBan.setBan')}
                    </Button>
                  )}
                </div>
              ) : (
                <div />
              )}
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
    reviews: state.quarantine.reviews,
    confirm: state.quarantine.confirm,
    error: state.quarantine.error,
    loading: state.quarantine.loading,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchQuarantineReviews: () => {
      dispatch(actions.fetchQuarantineReviews());
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
)(withTranslation()(withErrorHandler(QuarantineHistory)));
