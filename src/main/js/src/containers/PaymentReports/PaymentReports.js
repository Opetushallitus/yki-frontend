import axios from '../../axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';

import Button from '../../components/UI/Button/Button';
import DatePicker from '../../components/UI/DatePicker/DatePicker';
import Page from '../../hoc/Page/Page';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import classes from './PaymentReports.module.css';

const dateToString = (date) => date.format('YYYY-MM-DD');

const PaymentReports = props => {
  const { t, i18n } = props;

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const downloadReport = () => {
    axios.get(`/yki/api/payment/v2/report?from=${dateToString(startDate)}&to=${dateToString(endDate)}`)
  };

  const isRangeValid = startDate && endDate && startDate.isSameOrBefore(endDate);

  useEffect(() => {
    if (!startDate) {
      setStartDate(
        moment()
          .subtract(1, 'month')
          .startOf('month')
      );
    }
    if (!endDate) {
      setEndDate(
        moment()
          .subtract(1, 'month')
          .endOf('month')
      );
    }
  }, [startDate, endDate]);

  return (
    <Page>
      <div className={classes.PaymentReports}>
        <h1>{t('paymentReports.document.title')}</h1>
        <div className={classes.DateGrid}>
          <div className={classes.DatePickerWrapper}>
            <DatePicker
              id="paymentReportStartDate"
              options={{
                value: startDate ? dateToString(startDate) : '',
              }}
              onChange={d => setStartDate(moment(d[0]))}
              locale={i18n.language}
            />
          </div>
          <div className={classes.DatePickerWrapper}>
            <DatePicker
              id="paymentReportEndDate"
              options={{
                value: endDate ? dateToString(endDate) : '',
              }}
              onChange={d => setEndDate(moment(d[0]))}
              locale={i18n.language}
            />
          </div>
          <div className={classes.DownloadButtonWrapper}>
            <Button clicked={downloadReport} disabled={!isRangeValid}>
              {t('paymentReports.button.download')}
            </Button>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default withTranslation()(withErrorHandler(PaymentReports));
