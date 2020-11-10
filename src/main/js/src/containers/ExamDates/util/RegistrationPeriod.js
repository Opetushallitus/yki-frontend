import React from 'react';
import moment from "moment";
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';

import {DATE_FORMAT, DATE_FORMAT_WITHOUT_YEAR} from "../../../common/Constants";

const RegistrationPeriod = ({ period, withoutText }) => {
  const [t] = useTranslation();
  const start = moment(period[0].registration_start_date).format(DATE_FORMAT_WITHOUT_YEAR);
  const end = moment(period[0].registration_end_date).format(DATE_FORMAT);

  return (
    <>
      {withoutText ? null : `${t('common.registationPeriod')} `}
      {start}
      &nbsp;
      &ndash;
      &nbsp;
      {end}
    </>
  );
};

RegistrationPeriod.propTypes = {
  period: PropTypes.array.isRequired,
  withoutText: PropTypes.bool
};

export default RegistrationPeriod;