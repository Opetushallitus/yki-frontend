import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';

import { DATE_FORMAT, DATE_FORMAT_WITHOUT_YEAR } from '../../common/Constants';
import { languageToString, levelDescription } from '../../util/util';
import classes from './ExamSessions.module.css';
import { examSessionParticipantsCount } from '../../util/examSessionUtil';

export const upcomingAndPastExamSessions = props => {
  const today = moment();
  const upcomingExamSessions = props.examSessions.filter(es =>
    today.isSameOrBefore(es.session_date, 'day'),
  );
  const pastExamSessions = props.examSessions.filter(es =>
    today.isAfter(es.session_date, 'day'),
  );

  const renderExamSessionRows = (examSessions, cyPrefix) =>
    examSessions.map((e, i) => {
      const registrationOpen = moment().isSameOrAfter(
        moment(e.registration_start_date),
      );
      const participantsCount = examSessionParticipantsCount(e);

      return (
        <div
          className={classes.Row}
          key={i}
          data-cy={`${cyPrefix}-exam-sessions-table-row-${i}`}
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
              ? `${participantsCount.participants} / ${participantsCount.maxParticipants}`
              : '-'}
          </p>
        </div>
      );
    });

  return (
    <>
      <div>
        <h2>{props.t('examSession.upcomingExamSessions')}</h2>
        {upcomingExamSessions.length > 0 ? (
          <div className={classes.Grid} data-cy="upcoming-exam-sessions-table">
            <h3>{props.t('common.examDate')}</h3>
            <h3>{props.t('common.language')}</h3>
            <h3>{props.t('common.level')}</h3>
            <h3 className={classes.DesktopOnly}>
              {props.t('common.registrationPeriod')}
            </h3>
            <h3>{props.t('examSession.participants')}</h3>
            {renderExamSessionRows(upcomingExamSessions, 'upcoming')}
          </div>
        ) : (
          <p>{props.t('examSession.noUpcomingSessions')}</p>
        )}
      </div>
      <div>
        <h2>{props.t('examSession.pastExamSessions')}</h2>
        {pastExamSessions.length > 0 ? (
          <div className={classes.Grid} data-cy="past-exam-sessions-table">
            <h3>{props.t('common.examDate')}</h3>
            <h3>{props.t('common.language')}</h3>
            <h3>{props.t('common.level')}</h3>
            <h3 className={classes.DesktopOnly}>
              {props.t('common.registrationPeriod')}
            </h3>
            <h3>{props.t('examSession.participants')}</h3>
            {renderExamSessionRows(pastExamSessions, 'past')}
          </div>
        ) : (
          <p>{props.t('examSession.noPastSessions')}</p>
        )}
      </div>
    </>
  );
};

upcomingAndPastExamSessions.propTypes = {
  examSessions: PropTypes.array.isRequired,
  examSessionSelected: PropTypes.func.isRequired,
};
export default withTranslation()(upcomingAndPastExamSessions);
