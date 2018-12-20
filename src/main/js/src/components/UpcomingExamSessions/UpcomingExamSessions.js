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
        <div className={classes.Row} key={i}>
          <div>
            {moment(e.session_date).format(DATE_FORMAT)}
          </div>
          <div>
            {languageToString(e.language_code).toLowerCase()}
          </div>
          <div>{CODE_TO_LEVEL[e.level_code]}</div>
          <div>
            {moment(e.registration_start_date).format(DATE_FORMAT_WITHOUT_YEAR)}
            &ndash;
            {moment(e.registration_end_date).format(DATE_FORMAT)}
          </div>
          <div>
            {registrationOpen
              ? `${e.participants} / ${e.max_participants}`
              : '-'}
          </div>
        </div>
      );
    })
  );

  return (
    <div className={classes.ExamSessionList}>
      <h2>{props.t('examSession.upcomingExamSessions')}</h2>
      {props.examSessions.length > 0 ? (
        <div className={classes.Grid}>
            <div className={classes.Heading}>{props.t('common.examDate')}</div>
            <div className={classes.Heading}>{props.t('common.language')}</div>
            <div className={classes.Heading}>{props.t('common.level')}</div>
            <div className={classes.Heading}>{props.t('common.registationPeriod')}</div>
            <div className={classes.Heading}>{props.t('examSession.participants')}</div>
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
