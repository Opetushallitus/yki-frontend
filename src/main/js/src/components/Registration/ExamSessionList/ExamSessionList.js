import React from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import classes from './ExamSessionList.module.css';
import ExamSessionListItem from './ExamSessionListItem/ExamSessionListItem';

const examSessionList = ({ examSessions: sessions, language, t, history }) => (
  <>
    {Object.keys(sessions).length !== 0 ? (
      <>
        <div className={classes.ColumnHeaders}>
          <div>{t('registration.list.date')}</div>
          <div>{t('registration.list.place')}</div>
          <div>{t('registration.list.exam')}</div>
          <div>{t('registration.list.signupOpen')}</div>
          <div>{t('registration.list.examSpots')}</div>
        </div>
        <div className={classes.Date}>
          <div className={classes.List}>
            {sessions.map(e => (
              <ExamSessionListItem
                key={e.published_at}
                examSession={e}
                language={language}
                history={history}
              />
            ))}
          </div>
        </div>
      </>
    ) : (
        <p className={classes.NotFound}><b>{t('registration.search.noResults')}</b></p>
      )}
  </>
);

examSessionList.propTypes = {
  examSessions: PropTypes.array.isRequired,
  language: PropTypes.object.isRequired,
};

export default withTranslation()(examSessionList);
