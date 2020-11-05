import React from 'react';
import moment from 'moment';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import classes from './ExamSessionList.module.css';
import ExamSessionListItem from './ExamSessionListItem/ExamSessionListItem';
import { DATE_FORMAT } from '../../../common/Constants';

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
        {Object.keys(sessions).map(k => (
          <div key={k} className={classes.Date}>
            <div className={classes.ExamsOnDate}>
              <span>{moment(k).format(DATE_FORMAT)}</span>
              <span>
                {sessions[k].length}{' '}
                {sessions[k].length === 1
                  ? t('common.examSessions.amount.single')
                  : t('common.examSessions.amount')}
              </span>
            </div>
            <div className={classes.List}>
              {sessions[k].map(e => (
                <ExamSessionListItem
                  key={e.published_at}
                  examSession={e}
                  language={language}
                  history={history}
                />
              ))}
            </div>
          </div>
        ))}
      </>
    ) : (
        <p className={classes.NotFound}><b>{t('registration.search.noResults')}</b></p>
    )}
  </>
);

examSessionList.propTypes = {
  examSessions: PropTypes.object.isRequired,
  language: PropTypes.object.isRequired,
};

export default withTranslation()(examSessionList);
