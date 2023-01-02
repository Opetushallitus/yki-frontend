import moment from 'moment';

export const datePickerValueToDate = val => {
  const d = val[0];

  return d && moment(d).format('YYYY-MM-DD');
};
