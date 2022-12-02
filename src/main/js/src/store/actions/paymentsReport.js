import * as actionTypes from './actionTypes';
import axios from '../../axios';

export const fetchPaymentsReport = (startDate, endDate) => {
  return dispatch => {
    dispatch({
      type: actionTypes.FETCH_PAYMENTS_REPORT_START,
    });
    axios
      .get(`/yki/api/payment/v2/report?from=${startDate}&to=${endDate}`)
      .then(response => {
        dispatch({ type: actionTypes.FETCH_PAYMENTS_REPORT_SUCCESS, data: response.data.payments });
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
