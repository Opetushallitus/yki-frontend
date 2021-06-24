import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useMobileView } from '../../../util/customHooks';
import {
  examLanguageAndLevel,
  formatDate,
} from '../../../util/examSessionUtil';
import { sortObjectArray } from '../../../util/util';
import classes from './ReEvaluationList.module.css';

const ReEvaluationList = props => {
  const { t } = useTranslation();
  const isMobile = useMobileView(true);
  const { sessions, headers, history } = props;
  const [sortedSessions, setSortedSessions] = useState(sessions);
  const [sortToggleAsc, setSortToggleAsc] = useState(false);

  useEffect(() => {
    setSortedSessions(sortObjectArray(sessions, 'language_code', true));
  }, [sessions]);

  const headerRow = () => {
    return (
      <tr className={classes.ColumnHeaders}>
        {headers.map(header => {
          if (header.sortable) {
            return (
              <th key={header.key} className={classes.HeaderColumn}>
                {t(header.title)}
                <button
                  onClick={() => {
                    const sessionCopy = sortedSessions.slice();
                    setSortedSessions(
                      sortObjectArray(sessionCopy, header.key, sortToggleAsc),
                    );
                    setSortToggleAsc(!sortToggleAsc);
                  }}
                  className={classes.Sort}
                >
                  <img
                    src={require('../../../assets/svg/chevron-white.svg')}
                    className={classes.SortIcon}
                    alt="sort"
                  />
                </button>
              </th>
            );
          } else return <th key={header.key}>{t(header.title)}</th>;
        })}
      </tr>
    );
  };

  const dataRowDesktop = session => {
    const langAndLvl = examLanguageAndLevel(session);
    const examDate = formatDate(session, 'exam_date');
    const evaluationStartDate = formatDate(session, 'evaluation_start_date');
    const evaluationEndDate = formatDate(session, 'evaluation_end_date');
    const enabled = session.open;

    return (
      <tr
        className={classes.List}
        key={session.id}
        data-cy={`evaluation-period-${session.id}`}
      >
        <td className={classes.TableColumn}>
          <strong>{langAndLvl}</strong>
        </td>
        <td className={classes.TableColumn}>{examDate}</td>
        <td className={classes.TableColumn}>
          {evaluationStartDate} - {evaluationEndDate}
        </td>
        <td className={classes.TableColumn}>
          <button
            onClick={() => history.push(`/tarkistusarviointi/${session.id}`)}
            data-cy={`evaluation-period-button-${session.id}`}
            role="link"
            disabled={!enabled}
            className="YkiButton"
            style={{
              width: 'auto',
              padding: '0 1rem',
            }}
          >
            {t('registration.reeval')}
          </button>
        </td>
      </tr>
    );
  };

  const dataRowMobile = session => {
    const langAndLvl = examLanguageAndLevel(session);
    const examDate = formatDate(session, 'exam_date');
    const evaluationStartDate = formatDate(session, 'evaluation_start_date');
    const evaluationEndDate = formatDate(session, 'evaluation_end_date');
    const enabled = session.open;

    return (
      <tr
        className={classes.List}
        key={session.id}
        data-cy={`evaluation-period-${session.id}`}
      >
        <td className={classes.MobileRow}>
          <div className={classes.TableColumn}>{langAndLvl}</div>
          <div className={classes.TableColumn}>{examDate}</div>
        </td>
        <td className={classes.MobileRow}>
          <div className={classes.TableColumn}>
            {t('registration.list.evalPossible')}
          </div>
          <div className={classes.TableColumn}>
            {evaluationStartDate} - {evaluationEndDate}
          </div>
        </td>
        <td style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={() => history.push(`/tarkistusarviointi/${session.id}`)}
            data-cy={`evaluation-period-button-${session.id}`}
            role="link"
            className="YkiButton"
            disabled={!enabled}
            style={{
              padding: '0.25rem',
            }}
          >
            {t('registration.reeval')}
          </button>
        </td>
      </tr>
    );
  };

  return (
    <div className={classes.ReEvaluationList}>
      {sortedSessions && sortedSessions.length !== 0 ? (
        <table>
          <thead>{headerRow()}</thead>
          <tbody>
            {isMobile ? (
              <>
                {sortedSessions.map(session => {
                  return dataRowMobile(session);
                })}
              </>
            ) : (
              <>
                {sortedSessions.map(session => {
                  return dataRowDesktop(session);
                })}
              </>
            )}
          </tbody>
        </table>
      ) : (
        <p className={classes.NotFound}>
          <b>{t('registration.search.noResults')}</b>
        </p>
      )}
    </div>
  );
};

export default ReEvaluationList;
