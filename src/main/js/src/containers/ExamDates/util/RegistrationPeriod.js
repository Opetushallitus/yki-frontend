import React from 'react';
import moment from "moment";
import PropTypes from 'prop-types';

import {DATE_FORMAT} from "../../../common/Constants";

const RegistrationPeriod = ({ period }) => {
  const start = moment(period.registration_start_date).format(DATE_FORMAT);
  const end = moment(period.registration_end_date).format(DATE_FORMAT);

  return (
    <>
      {start}
      &nbsp;
      &ndash;
      &nbsp;
      {end}
    </>
  );
};

RegistrationPeriod.propTypes = {
  period: PropTypes.object.isRequired,
};

export default RegistrationPeriod;