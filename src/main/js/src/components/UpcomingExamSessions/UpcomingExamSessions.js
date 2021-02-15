import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import moment from 'moment';

import classes from './UpcomingExamSessions.module.css';
import { DATE_FORMAT, DATE_FORMAT_WITHOUT_YEAR } from '../../common/Constants';
import { languageToString, levelDescription } from '../../util/util';
import Checkbox from "../UI/Checkbox/Checkbox";

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
          {registrationOpen ? `${e.participants + e.pa_participants} / ${e.max_participants + postAdmissionQuota}` : '-'}
        </p>
      </div>
    );
  });

  const togglePastCheckbox = (
    <>
      {props.togglePastExamSessions &&
        <>
          <div className={classes.ShowPastSessionsItem}>{props.t('examSessions.showPastSessions')}</div>
          <div className={classes.ShowPastSessionsItem}>
            <Checkbox
              checked={props.showPastExamSessions}
              datacy="exam-sessions-toggle-past-checkbox"
              onChange={() => props.togglePastExamSessions()}
            />
          </div>
        </>}
    </>
  )

  return (
    <div className={classes.ExamSessionList}>
      <div className={classes.TitleRow}>
        <h2>{props.t('examSession.upcomingExamSessions')}</h2>
        {togglePastCheckbox}
      </div>
      {props.examSessions.length > 0 ? (
        <div className={classes.Grid} data-cy="exam-sessions-table">
          <h3>{props.t('common.examDate')}</h3>
          <h3>{props.t('common.language')}</h3>
          <h3>{props.t('common.level')}</h3>
          <h3 className={classes.DesktopOnly}>
            {props.t('common.registationPeriod')}
          </h3>
          <h3>{props.t('examSession.participants')}</h3>
          {examSessionRows}
        </div>
      ) : (
          <p>{props.t('examSession.noPlannedSessions')}</p>
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
