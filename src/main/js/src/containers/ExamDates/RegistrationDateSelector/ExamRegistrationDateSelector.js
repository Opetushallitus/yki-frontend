import React from 'react';
import {withTranslation} from "react-i18next";
import moment from "moment";
import {DATE_FORMAT, DATE_FORMAT_WITHOUT_YEAR} from "../../../common/Constants";

import classes from './ExamRegistrationDateSelector.module.css';
import PropTypes from "prop-types";

const ExamRegistrationDatesSelector = (props) => {
  const {examDates, t} = props;
  return (
      <>
        <select className={classes.ExamRegistrationDates}>
          {examDates.map((date, i) => {
            return (
                <option key={i}>
                  {t('common.registationPeriod')}{' '}
                  {moment(date[0].registration_start_date).format(
                      DATE_FORMAT_WITHOUT_YEAR,
                  )}
                  &nbsp;
                  &ndash;
                  &nbsp;
                  {moment(date[0].registration_end_date).format(DATE_FORMAT)}
                </option>
            )
          })}
        </select>
      </>
  );
};


ExamRegistrationDatesSelector.propTypes = {
  examDates: PropTypes.array.isRequired,
}

export default withTranslation()(ExamRegistrationDatesSelector);