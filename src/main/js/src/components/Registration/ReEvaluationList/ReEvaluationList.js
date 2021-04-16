import React from 'react';
import { useTranslation } from 'react-i18next';

import { MOBILE_VIEW } from '../../../common/Constants';
import {
  examLanguageAndLevel,
  formatDate,
} from '../../../util/examSessionUtil';
import classes from './ReEvaluationList.module.css';

const ReEvaluationList = props => {
  const { t } = useTranslation();
  const { sessions, headers, history } = props;

  const headerRow = () => {
    return (
      <div className={classes.ColumnHeaders}>
        {headers.map(header => {
          if (header.sortable) {
            return (
              <div key={header.key} className={classes.HeaderColumn}>
                {t(header.title)}
                <button
                  onClick={() => console.log('sortClicked')}
                  className={classes.Sort}
                >
                  <img
                    src={require('../../../assets/svg/chevron-white.svg')}
                    className={classes.SortIcon}
                    alt=""
                  />
                </button>
              </div>
            );
          } else return <div key={header.key}>{t(header.title)}</div>;
        })}
      </div>
    );
  };

  const dataRowDesktop = session => {
    const langAndLvl = examLanguageAndLevel(session);
    const examDate = formatDate(session, 'exam_date');
    const evaluationStartDate = formatDate(session, 'evaluation_start_date');
    const evaluationEndDate = formatDate(session, 'evaluation_end_date');

    return (
      <div className={classes.List} key={session.id}>
        <div className={classes.TableColumn}>
          <strong>{langAndLvl}</strong>
        </div>
        <div className={classes.TableColumn}>{examDate}</div>
        <div className={classes.TableColumn}>
          {evaluationStartDate} - {evaluationEndDate}
        </div>
        <div className={classes.TableColumn}>
          <button
            onClick={() => history.push(`/tarkistusarviointi/${session.id}`)}
            role="link"
            className="YkiButton"
            style={{
              backgroundColor: 'hsla(194, 91%, 21%, 1)',
              padding: '0.25rem',
            }}
          >
            {t('registration.reeval')}
          </button>
        </div>
      </div>
    );
  };

  const dataRowMobile = session => {
    const langAndLvl = examLanguageAndLevel(session);
    const examDate = formatDate(session, 'exam_date');
    const evaluationStartDate = formatDate(session, 'evaluation_start_date');
    const evaluationEndDate = formatDate(session, 'evaluation_end_date');

    return (
      <div className={classes.List} key={session.id}>
        <div className={classes.MobileRow}>
          <div className={classes.TableColumn}>{langAndLvl}</div>
          <div className={classes.TableColumn}>{examDate}</div>
        </div>
        <div className={classes.MobileRow}>
          <div className={classes.TableColumn}>
            {t('registration.list.evalPossible')}
          </div>
          <div className={classes.TableColumn}>
            {evaluationStartDate} - {evaluationEndDate}
          </div>
        </div>

        <button
          onClick={() => history.push(`/tarkistusarviointi/${session.id}`)}
          role="link"
          className="YkiButton"
          style={{
            backgroundColor: 'hsla(194, 91%, 21%, 1)',
            padding: '0.25rem',
          }}
        >
          {t('registration.reeval')}
        </button>
      </div>
    );
  };

  return (
    <>
      {sessions && sessions.length !== 0 ? (
        <div style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
          {MOBILE_VIEW ? (
            <div className={classes.Date}>
              {sessions.map(session => {
                return dataRowMobile(session);
              })}
            </div>
          ) : (
            <>
              <div>{headerRow()}</div>
              <div className={classes.Date}>
                {sessions.map(session => {
                  return dataRowDesktop(session);
                })}
              </div>
            </>
          )}
        </div>
      ) : (
        <p className={classes.NotFound}>
          <b>{t('registration.search.noResults')}</b>
        </p>
      )}
    </>
  );
};

export default ReEvaluationList;
