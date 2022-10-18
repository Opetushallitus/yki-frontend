import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import Button from '../../components/UI/Button/Button';
import DatePicker from '../../components/UI/DatePicker/DatePicker';
import Page from '../../hoc/Page/Page';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import classes from './PaymentsReport.module.css';
import * as actions from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';

const dateToString = date => date.format('YYYY-MM-DD');

const downloadBlob = (data, startDate, endDate) => {
  const blob = URL.createObjectURL(data);
  const link = document.createElement('a');
  link.download = `YKI_tutkintomaksut_${startDate.format(
    'YYYY-MM-DD',
  )}_${endDate.format('YYYY-MM-DD')}.csv`;
  link.href = blob;
  document.body.appendChild(link);
  link.click();
  link.remove();

  // Cleanup.
  return () =>
    setTimeout(() => {
      window.URL.revokeObjectURL(blob);
    }, 100);
};

const PaymentsReport = props => {
  const { t, i18n, onFetchPaymentsReport, data, loading } = props;

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const doFetchPaymentsReport = () => {
    onFetchPaymentsReport(startDate, endDate);
  };

  const isRangeValid =
    startDate && endDate && startDate.isSameOrBefore(endDate);

  useEffect(() => {
    if (!startDate) {
      setStartDate(
        moment()
          .subtract(1, 'month')
          .startOf('month'),
      );
    }
    if (!endDate) {
      setEndDate(
        moment()
          .subtract(1, 'month')
          .endOf('month'),
      );
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (data) {
      const cleanUp = downloadBlob(data, startDate, endDate);
      return cleanUp;
    }
  }, [data]);

  return (
    <Page>
      <div className={classes.PaymentsReport}>
        <h1>{t('paymentsReport.document.title')}</h1>
        <div className={classes.DateGrid}>
          <div className={classes.DatePickerWrapper}>
            <DatePicker
              id="paymentsReportStartDate"
              options={{
                value: startDate ? dateToString(startDate) : '',
              }}
              onChange={d => setStartDate(moment(d[0]))}
              locale={i18n.language}
            />
          </div>
          <div className={classes.DatePickerWrapper}>
            <DatePicker
              id="paymentsReportEndDate"
              options={{
                value: endDate ? dateToString(endDate) : '',
              }}
              onChange={d => setEndDate(moment(d[0]))}
              locale={i18n.language}
            />
          </div>
          <div className={classes.DownloadButtonWrapper}>
            {loading ? (
              <Spinner />
            ) : (
              <Button clicked={doFetchPaymentsReport} disabled={!isRangeValid}>
                {t('paymentsReport.button.download')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Page>
  );
};

const mapStateToProps = state => {
  return {
    error: state.paymentsReport.error,
    loading: state.paymentsReport.loading,
    data: state.paymentsReport.data,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchPaymentsReport: (startDate, endDate) => {
      dispatch(
        actions.fetchPaymentsReport(
          dateToString(startDate),
          dateToString(endDate),
        ),
      );
    },
    errorConfirmedHandler: () => dispatch(actions.fetchPaymentsReportReset()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(withErrorHandler(PaymentsReport)));
