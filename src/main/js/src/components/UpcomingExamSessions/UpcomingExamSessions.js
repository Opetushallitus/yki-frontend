import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import moment from 'moment';

import classes from './UpcomingExamSessions.module.css';
import {
  DATE_FORMAT,
  DATE_FORMAT_WITHOUT_YEAR,
  CODE_TO_LEVEL,
} from '../../common/Constants';
import Spinner from '../UI/Spinner/Spinner';
import { languageToString } from '../../util/registryUtil';

const upcomingExamSessions = props => {
  const examSessionRows = props.loading ? (
    <Spinner />
  ) : (
    props.examSessions.map((e, i) => {
      const registrationOpen = moment().isSameOrAfter(
        moment(e.registration_start_date),
      );
      return (
        <div className={classes.Row} key={i} data-cy="exam-sessions-table-row">
          <p>
            {moment(e.session_date).format(DATE_FORMAT)}
          </p>
          <p>
            {languageToString(e.language_code).toLowerCase()}
          </p>
          <p>{CODE_TO_LEVEL[e.level_code]}</p>
          <p>
            {moment(e.registration_start_date).format(DATE_FORMAT_WITHOUT_YEAR)}
            &ndash;
            {moment(e.registration_end_date).format(DATE_FORMAT)}
          </p>
          <p>
            {registrationOpen
              ? `${e.participants} / ${e.max_participants}`
              : '-'}
          </p>
        </div>
      );
    })
  );

  return (
    <div className={classes.ExamSessionList}>
      <h2>{props.t('examSession.upcomingExamSessions')}</h2>
      {props.examSessions.length > 0 ? (
        <div className={classes.Grid} data-cy="exam-sessions-table">
            <h3>{props.t('common.examDate')}</h3>
            <h3>{props.t('common.language')}</h3>
            <h3>{props.t('common.level')}</h3>
            <h3>{props.t('common.registationPeriod')}</h3>
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
  organizer: PropTypes.object.isRequired,
  examSessions: PropTypes.array.isRequired,
};

export default withNamespaces()(upcomingExamSessions);
