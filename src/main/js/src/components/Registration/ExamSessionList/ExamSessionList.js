import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';

import classes from './ExamSessionList.module.css';
import ExamSessionListItem from './ExamSessionListItem/ExamSessionListItem';

const examSessionList = ({ examSessions: sessions, language, t, history }) => (
  <div className={classes.ExamSessionList}>
    {Object.keys(sessions).length !== 0 ? (
      <table>
        <thead>
          <tr className={classes.ColumnHeaders}>
            <th>{t('common.exam')}</th>
            <th>{t('common.testDay')}</th>
            <th>{t('common.testPlace')}</th>
            <th>{t('common.registrationPeriod')}</th>
            <th>{t('registration.list.examSpots')}</th>
            <th />
          </tr>
        </thead>
        <tbody className={classes.List}>
          {sessions.map((e, i) => (
            <ExamSessionListItem
              key={e.published_at + i}
              examSession={e}
              language={language}
              history={history}
            />
          ))}
        </tbody>
      </table>
    ) : (
      <p className={classes.NotFound}>
        <b>{t('registration.search.noResults')}</b>
      </p>
    )}
  </div>
);

examSessionList.propTypes = {
  examSessions: PropTypes.array.isRequired,
  language: PropTypes.object.isRequired,
};

export default withTranslation()(examSessionList);
