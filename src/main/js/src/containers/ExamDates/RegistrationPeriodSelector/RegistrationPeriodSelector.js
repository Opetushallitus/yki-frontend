import React from 'react';
import {withTranslation} from "react-i18next";
import moment from "moment";
import {DATE_FORMAT, DATE_FORMAT_WITHOUT_YEAR} from "../../../common/Constants";

import classes from './RegistrationPeriodSelector.module.css';
import PropTypes from "prop-types";
import RegistrationPeriod from "../util/RegistrationPeriod";

const RegistrationPeriodSelector = (props) => {
  const {registrationPeriods, t} = props;

  const onSelect = index => {
    const result = parseInt(index.target.value, 10);
    return props.onIndexSelect(result);
  }

  return (
      <>
        <select className={classes.ExamRegistrationDates} onChange={index => onSelect(index)}>
          {registrationPeriods.map((period, i) => {
            return (
                <option key={i} value={i}>
                  {t('common.registationPeriod')}{' '}
                  {moment(period[0].registration_start_date).format(
                      DATE_FORMAT_WITHOUT_YEAR,
                  )}
                  &nbsp;
                  &ndash;
                  &nbsp;
                  {moment(period[0].registration_end_date).format(DATE_FORMAT)}
                </option>
            )
          })}
        </select>
      </>
  );
};


RegistrationPeriodSelector.propTypes = {
  registrationPeriods: PropTypes.array.isRequired,
}

export default withTranslation()(RegistrationPeriodSelector);