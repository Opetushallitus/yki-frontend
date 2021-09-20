import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';

import classes from './ExamSessionList.module.css';
import ExamSessionListItem from './ExamSessionListItem/ExamSessionListItem';
import * as i18nKeys from "../../../common/LocalizationKeys";

const examSessionList = ({ examSessions: sessions, language, t, history }) => (
  <div className={classes.ExamSessionList}>
    {Object.keys(sessions).length !== 0 ? (
      <table>
        <thead>
          <tr className={classes.ColumnHeaders}>
            <th>{t(i18nKeys.registration_list_exam)}</th>
            <th>{t(i18nKeys.registration_list_date)}</th>
            <th>{t(i18nKeys.registration_list_place)}</th>
            <th>{t(i18nKeys.registration_list_signupOpen)}</th>
            <th>{t(i18nKeys.registration_list_examSpots)}</th>
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
        <b>{t(i18nKeys.registration_search_noResults)}</b>
      </p>
    )}
  </div>
);

examSessionList.propTypes = {
  examSessions: PropTypes.array.isRequired,
  language: PropTypes.object.isRequired,
};

export default withTranslation()(examSessionList);
