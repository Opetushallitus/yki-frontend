import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import XLSX from 'xlsx';

import Button from '../../components/UI/Button/Button';
import DatePicker from '../../components/UI/DatePicker/DatePicker';
import Page from '../../hoc/Page/Page';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import classes from './PaymentsReport.module.css';
import * as actions from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';

const dateToString = date => date.format('YYYY-MM-DD');

const download = (url, startDate, endDate) => {
  const link = document.createElement('a');
  link.download = `YKI_tutkintomaksut_${startDate.format(
    'YYYY-MM-DD',
  )}_${endDate.format('YYYY-MM-DD')}.xlsx`;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  link.remove();

  // Cleanup.
  return () =>
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 100);
};

const toArrayBuffer = s => {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);

  for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
  return buf;
};

const exportToExcel = (payments, startDate, endDate) => {
  const defaultCol = { wch: 20 };

  const columns = [
    { wch: 40 },
    defaultCol,
    defaultCol,
    defaultCol,
    defaultCol,
    { wch: 40 },
    { wch: 40 },
    defaultCol,
    { wch: 60 },
  ];
  const data = payments.map(p => {
    return {
      "Järjestäjä": p.organizer,
      "Maksun aikaleima": p.paid_at,
      "Koepäivä": p.exam_date,
      "Alkuperäinen koepäivä": p.original_exam_date,
      "Kieli": p.exam_language,
      "Taso": p.exam_level,
      "Osallistujan nimi": p.name,
      "Osallistujan sähköposti": p.email,
      "Summa (€)": p.amount,
      "Maksun yksilöintitunnus": p.reference,
    };
  });
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data,
    { header: ["Järjestäjä", "Maksun aikaleima", "Koepäivä", "Alkuperäinen koepäivä", "Kieli", "Taso", "Osallistujan nimi",
     "Osallistujan sähköposti", "Summa (€)", "Maksun yksilöintitunnus"]});

  worksheet['!cols'] = columns;
  const sheetName = 'maksuraportti';
  workbook.SheetNames.push(sheetName);
  workbook.Sheets[sheetName] = worksheet;

  const workbookOut = XLSX.write(workbook, {
    bookType: 'xlsx',
    bookSST: true,
    type: 'binary',
  });

  let url = window.URL.createObjectURL(
    new Blob([toArrayBuffer(workbookOut)], {
      type: 'application/octet-stream',
    }),
  );
  return download(url, startDate, endDate);
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
      const cleanUp = exportToExcel(data, startDate, endDate);
      return cleanUp;
    }
  }, [data]);

  return (
    <Page>
      <div className={classes.PaymentsReport}>
        <h1>{t('paymentsReport.document.title')}</h1>
        <p>{t('paymentsReport.document.text1')}</p>
        <p>{t('paymentsReport.document.text2')}</p>
        <p>{t('paymentsReport.document.text3')}</p>
        <div className={classes.DateGrid}>
          <div>{t('paymentsReport.input.from')}</div>
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
          <div>{t('paymentsReport.input.to')}</div>
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
          <div />
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
