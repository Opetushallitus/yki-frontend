import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  DATE_FORMAT,
  DATE_FORMAT_WITHOUT_YEAR,
  MOBILE_VIEW,
} from '../../../common/Constants';
import { levelDescription } from '../../../util/util';
import classes from './ReEvaluationList.module.css';

const ReEvaluationList = props => {
  const { t } = useTranslation();
  //   const {sessions, headers} = props;

  const headers = [
    { title: 'registration.list.exam', key: 'exam', sortable: true },
    { title: 'registration.list.date', key: 'date', sortable: true },
    {
      title: 'registration.list.evalPossible',
      key: 'evalTimeFrame',
      sortable: true,
    },
    { title: '', key: 'actionButton', sortable: false },
  ];
  const sessions = [
    {
      exam_date: '2021-04-02',
      language_code: 'fin',
      level_code: 'KESKI',
      evaluation_start_date: '2021-04-01',
      evaluation_end_date: '2021-05-30',
      open: true,
    },
    {
      exam_date: '2021-04-01',
      language_code: 'fin',
      level_code: 'PERUS',
      evaluation_start_date: '2041-08-01',
      evaluation_end_date: '2041-08-15',
      open: false,
    },
  ];

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
                  role="button"
                  className={classes.Sort}
                >
                  <img
                    src={require('../../../assets/svg/chevron-white.svg')}
                    className={classes.SortIcon}
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
    const examLanguage = t(`common.language.${session.language_code}`);
    const examLevel = levelDescription(session.level_code).toLowerCase();
    const examDate = moment(session.exam_date).format(DATE_FORMAT);
    const evaluationStartDate = moment(session.evaluation_start_date).format(
      DATE_FORMAT,
    );
    const evaluationEndDate = moment(session.evaluation_end_date).format(
      DATE_FORMAT,
    );

    return (
      <div className={classes.List}>
        <div className={classes.TableColumn}>
          <strong>{`${examLanguage}, ${examLevel}`}</strong>
        </div>
        <div className={classes.TableColumn}>{examDate}</div>
        <div className={classes.TableColumn}>
          {evaluationStartDate} - {evaluationEndDate}
        </div>
        <div className={classes.TableColumn}>
          <button
            onClick={() => console.log('button clicked')}
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
    const examLanguage = t(`common.language.${session.language_code}`);
    const examLevel = levelDescription(session.level_code).toLowerCase();
    const examDate = moment(session.exam_date).format(DATE_FORMAT);
    const evaluationStartDate = moment(session.evaluation_start_date).format(
      DATE_FORMAT,
    );
    const evaluationEndDate = moment(session.evaluation_end_date).format(
      DATE_FORMAT,
    );
    return (
      <div className={classes.List}>
        <div className={classes.MobileRow}>
          <div
            className={classes.TableColumn}
          >{`${examLanguage}, ${examLevel}`}</div>
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
          onClick={() => console.log('button clicked')}
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
        <>
          {MOBILE_VIEW ? (
            <div className={classes.Date}>
              {sessions.map((session, i) => {
                {
                  /* <ExamSessionListItem
                key={e.published_at + i}
                examSession={e}
                language={language}
                history={history}
              /> */
                }
                return dataRowMobile(session);
              })}
            </div>
          ) : (
            <>
              <div>{headerRow()}</div>
              <div className={classes.Date}>
                {sessions.map((session, i) => {
                  {
                    /* <ExamSessionListItem
                key={e.published_at + i}
                examSession={e}
                language={language}
                history={history}
              /> */
                  }
                  return dataRowDesktop(session);
                })}
              </div>
            </>
          )}
        </>
      ) : (
        <p className={classes.NotFound}>
          <b>{t('registration.search.noResults')}</b>
        </p>
      )}
    </>
  );
};

export default ReEvaluationList;
