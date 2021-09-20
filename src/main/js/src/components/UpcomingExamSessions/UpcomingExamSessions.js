import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';

import { DATE_FORMAT, DATE_FORMAT_WITHOUT_YEAR } from '../../common/Constants';
import { languageToString, levelDescription } from '../../util/util';
import Checkbox from '../UI/Checkbox/Checkbox';
import classes from './UpcomingExamSessions.module.css';
import * as i18nKeys from "../../common/LocalizationKeys";

export const upcomingExamSessions = props => {
  const examSessionRows = props.examSessions.map((e, i) => {
    const registrationOpen = moment().isSameOrAfter(
      moment(e.registration_start_date),
    );

    const postAdmissionQuota = e.post_admission_quota || 0;

    return (
      <div
        className={classes.Row}
        key={i}
        data-cy={`exam-sessions-table-row-${i}`}
        onClick={() => props.examSessionSelected(e)}
      >
        <p>{moment(e.session_date).format(DATE_FORMAT)}</p>
        <p>{languageToString(e.language_code).toLowerCase()}</p>
        <p>{levelDescription(e.level_code).toLowerCase()}</p>
        <p className={classes.DesktopOnly}>
          {moment(e.registration_start_date).format(DATE_FORMAT_WITHOUT_YEAR)}
          &ndash;
          {moment(e.registration_end_date).format(DATE_FORMAT)}
        </p>
        <p>
          {registrationOpen
            ? `${e.participants + e.pa_participants} / ${e.max_participants +
                postAdmissionQuota}`
            : '-'}
        </p>
      </div>
    );
  });

  const togglePastCheckbox = (
    <div className={classes.CheckboxContainer}>
      {props.togglePastExamSessions && (
        <Checkbox
          label={props.t(i18nKeys.examSessions_showPastSessions)}
          ariaLabel={props.t(i18nKeys.examSessions_showPastSessions)}
          checked={props.showPastExamSessions}
          datacy="exam-sessions-toggle-past-checkbox"
          onChange={() => props.togglePastExamSessions()}
          checkboxId="past-sessions"
          checkBoxClass={classes.CheckBox}
        />
      )}
    </div>
  );

  return (
    <div className={classes.ExamSessionList}>
      <div className={classes.TitleRow}>
        <h2>{props.t(i18nKeys.examSession_upcomingExamSessions)}</h2>
        {togglePastCheckbox}
      </div>
      {props.examSessions.length > 0 ? (
        <div className={classes.Grid} data-cy="exam-sessions-table">
          <h3>{props.t(i18nKeys.common_examDate)}</h3>
          <h3>{props.t(i18nKeys.common_language)}</h3>
          <h3>{props.t(i18nKeys.common_level)}</h3>
          <h3 className={classes.DesktopOnly}>
            {props.t(i18nKeys.common_registationPeriod)}
          </h3>
          <h3>{props.t(i18nKeys.examSession_participants)}</h3>
          {examSessionRows}
        </div>
      ) : (
        <p>{props.t(i18nKeys.examSession_noPlannedSessions)}</p>
      )}
    </div>
  );
};

upcomingExamSessions.propTypes = {
  examSessions: PropTypes.array.isRequired,
  examSessionSelected: PropTypes.func.isRequired,
  showPastExamSessions: PropTypes.bool,
  togglePastExamSessions: PropTypes.func,
};
export default withTranslation()(upcomingExamSessions);
