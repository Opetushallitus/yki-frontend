import * as actionTypes from './actionTypes';
import axios from '../../axios';

export const fetchPaymentsReport = (startDate, endDate, download) => {
  return dispatch => {
    dispatch({
      type: actionTypes.FETCH_PAYMENTS_REPORT_START,
    });
    axios
      .get(`/yki/api/payment/v2/report?from=${startDate}&to=${endDate}`, {
        responseType: 'blob',
      })
      .then(response => {
        dispatch({ type: actionTypes.FETCH_PAYMENTS_REPORT_SUCCESS });
        download(response.data);
      })
      .catch(error => {
        dispatch({ type: actionTypes.FETCH_PAYMENTS_REPORT_FAIL, error });
      });
  };
};

export const fetchPaymentsReportReset = () => {
  return dispatch => {
    dispatch({ type: actionTypes.FETCH_PAYMENTS_REPORT_RESET });
  };
};
