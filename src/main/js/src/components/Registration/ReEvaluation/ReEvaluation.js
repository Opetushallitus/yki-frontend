import React from 'react';
import { useTranslation } from 'react-i18next';

import YkiImage2 from '../../../assets/images/ophYki_image2.png';
import { MOBILE_VIEW } from '../../../common/Constants';
import {
  evaluationPriceElements,
  getDeviceOrientation,
} from '../../../util/util';
import HeadlineContainer from '../../HeadlineContainer/HeadlineContainer';
import PriceContainer from '../../PriceContainer/PriceContainer';
import ReEvaluationList from '../ReEvaluationList/ReEvaluationList';
import classes from './ReEvaluation.module.css';

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
    id: '1',
    exam_date: '2021-04-02',
    language_code: 'fin',
    level_code: 'KESKI',
    evaluation_start_date: '2021-04-01',
    evaluation_end_date: '2021-05-30',
    open: true,
  },
  {
    id: '2',
    exam_date: '2021-04-01',
    language_code: 'fin',
    level_code: 'PERUS',
    evaluation_start_date: '2041-08-01',
    evaluation_end_date: '2041-08-15',
    open: false,
  },
];

const ReEvaluation = ({ history }) => {
  const { t } = useTranslation();

  const desktopContent = (
    <div className={classes.MainContent}>
      <div className={classes.DescriptionAndText}>
        <div className={classes.InnerContainer}>
          <article className={classes.ArticleContent}>
            <p>{t('registration.reeval.text2')}</p>
            <p>{t('registration.reeval.text3')}</p>
            <p>{t('registration.reeval.text4')}</p>
          </article>
        </div>
        <PriceContainer elements={evaluationPriceElements} />
      </div>
      <ReEvaluationList
        history={history}
        headers={headers}
        sessions={sessions}
      />
    </div>
  );

  const mobileContent = (
    <div className={classes.MainContent}>
      <div className={classes.DescriptionAndText}>
        <div className={classes.InnerContainer}>
          <article className={classes.ArticleContent}>
            <p>{t('registration.reeval.text2')}</p>
            <p>{t('registration.reeval.text3')}</p>
            <p>{t('registration.reeval.text4')}</p>
          </article>
        </div>
        <PriceContainer elements={evaluationPriceElements} />
      </div>
      <ReEvaluationList
        history={history}
        headers={headers}
        sessions={sessions}
      />
    </div>
  );

  return (
    <>
      <main className={classes.Container}>
        <HeadlineContainer
          headlineTitle={t('registration.reeval.title')}
          headlineContent={<p>{t('registration.reeval.text1')}</p>}
          headlineImage={YkiImage2}
        />
        {MOBILE_VIEW ||
        (MOBILE_VIEW && getDeviceOrientation() === 'landscape') ? (
          <>{mobileContent}</>
        ) : (
          <>{desktopContent}</>
        )}
      </main>
    </>
  );
};

export default ReEvaluation;
