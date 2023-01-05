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

const QuarantineHistory = props => {
  const {
    t,
    reviews,
    onFetchQuarantineReviews,
    setQuarantine,
    confirmQuarantine,
    confirm,
    loading,
    error,
  } = props;
  const findLang = (language) => LANGUAGES.find(l => l.code === language).name;
  const closeConfirmModal = () => confirmQuarantine(null);
  const hasError = !R.isNil(error);

  useEffect(onFetchQuarantineReviews, [hasError]);

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
          loading={loading}
        />
      )}
      <div className={classes.QuarantineMatches}>
        <h1>
          {t('quarantine.reviewsTitle')}
        </h1>

        <QuarantineNav t={t} />

        <p>
          {t('quarantine.reviewsDescription')}
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
          <div className={classes.ListHeader}>
            {t('quarantine.status')}
          </div>
          <div/>
          {reviews.map(review => (
            <React.Fragment key={`quarantine-match-row-${review.quarantine_id}`}>
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
                <span>
                  {review.form.email}&nbsp;<br/>
                </span>
                <span>
                  {review.email}
                </span>
              </div>
              <div className={classes.ListRow}>
                <span>
                  {moment(review.form.birthdate).format(DATE_FORMAT)}&nbsp;
                </span>
                <span>
                  {moment(review.birthdate).format(DATE_FORMAT)}
                </span>
              </div>
              <div className={classes.ListRow}>
                <span>
                  {review.phone_number}
                </span>
                <span>
                  {review.form.phone_number}
                </span>
              </div>
              <div className={classes.ListRow}>
                {review.is_quarantined
                 ? t('quarantine.quarantined')
                 : t('quarantine.notQuarantined')}
              </div>
              <div data-cy={`${review.is_quarantined ? 'unset' : 'set'}-quarantine-btn`}>
                {review.is_quarantined ? (
                  <Button
                    disabled={loading}
                    clicked={doSetQuarantine.bind(
                      this,
                      review.quarantine_id,
                      review.registration_id,
                      false
                    )}>
                    {t('quarantine.cancelQuarantine')}
                  </Button>
                ) : (
                  <Button
                    disabled={loading}
                    clicked={showQuarantineConfirm.bind(
                      this,
                      review.quarantine_id,
                      review.registration_id
                    )}>
                    {t('quarantine.setQuarantine')}
                  </Button>
                )}
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
)(withTranslation()(withErrorHandler(QuarantineHistory)));
