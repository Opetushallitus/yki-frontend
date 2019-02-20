import React from 'react';
import moment from 'moment';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import classes from './ExamSessionList.module.css';
import ExamSessionListItem from './ExamSessionListItem/ExamSessionListItem';
import { DATE_FORMAT } from '../../../common/Constants';

const examSessionList = ({ examSessions: sessions, language, t }) => {
  const list =
    Object.keys(sessions).length !== 0 ? (
      <div>
        {Object.keys(sessions).map(k => (
          <div key={k}>
            <div className={classes.ExamsOnDate}>
              <span>{moment(k).format(DATE_FORMAT)}</span>
              <span>
                {sessions[k].length}{' '}
                {sessions[k].length === 1
                  ? t('common.examSessions.amount.single')
                  : t('common.examSessions.amount')}
              </span>
            </div>
            <hr />
            {sessions[k].map(e => (
              <ExamSessionListItem
                key={e.published_at}
                examSession={e}
                language={language}
              />
            ))}
          </div>
        ))}
      </div>
    ) : (
      <p>{t('registration.search.noResults')}</p>
    );
  return <React.Fragment>{list}</React.Fragment>;
};

examSessionList.propTypes = {
  examSessions: PropTypes.object.isRequired,
  language: PropTypes.object.isRequired,
};

export default withTranslation()(examSessionList);
