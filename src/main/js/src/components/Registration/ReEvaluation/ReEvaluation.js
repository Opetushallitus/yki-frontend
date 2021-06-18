import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { connect as connectRedux } from 'react-redux';

import YkiImage2 from '../../../assets/images/ophYki_image2.png';
import { MOBILE_VIEW } from '../../../common/Constants';
import { fetchReEvaluationPeriods, fetchPrices } from '../../../store/actions/index';
import {
  evaluationTexts,
  formatPriceObject,
  getDeviceOrientation,
} from '../../../util/util';
import HeadlineContainer from '../../HeadlineContainer/HeadlineContainer';
import PriceContainer from '../../PriceContainer/PriceContainer';
import ReEvaluationList from '../ReEvaluationList/ReEvaluationList';
import classes from './ReEvaluation.module.css';

const headers = [
  { title: 'registration.list.exam', key: 'language_code', sortable: true },
  { title: 'registration.list.date', key: 'exam_date', sortable: true },
  {
    title: 'registration.list.evalPossible',
    key: 'evaluation_start_date',
    sortable: true,
  },
  { title: '', key: 'actionButton', sortable: false },
];

const mapStateToProps = state => {
  return {
    prices: state.registration.prices,
    loadingPrices: state.registration.loadingPrices,
    evaluationPeriods: state.registration.evaluationPeriods,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchEvaluationPeriods: () => dispatch(fetchReEvaluationPeriods()),
    onFetchPrices: () => dispatch(fetchPrices())
  };
};

const ReEvaluation = ({
  history,
  prices,
  evaluationPeriods,
  onFetchEvaluationPeriods,
  onFetchPrices,
  loadingPrices
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    onFetchEvaluationPeriods();
    Object.keys(prices).length === 0 && !loadingPrices && onFetchPrices()
  }, []);

  const evalPrices = prices && prices['evaluation-prices'];

  const evaluationPrices = formatPriceObject(evalPrices, evaluationTexts);

  const desktopContent = (
    <div className={classes.MainContent}>
      <div className={classes.DescriptionAndText}>
        <div className={classes.InnerContainer}>
          <article className={classes.ArticleContent}>
            <p>{t('registration.reeval.text2')}</p>
            <p>{t('registration.reeval.text3')}</p>
            <p>{t('registration.reeval.text4')}</p>
            <p>{t('registration.reeval.text5')}</p>
            <p>{t('registration.reeval.text6')}</p>
          </article>
        </div>
        <PriceContainer elements={evaluationPrices} />
      </div>
      <ReEvaluationList
        history={history}
        headers={headers}
        sessions={evaluationPeriods}
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
            <p>{t('registration.reeval.text5')}</p>
            <p>{t('registration.reeval.text6')}</p>
          </article>
        </div>
        <PriceContainer elements={evaluationPrices} />
      </div>
      <ReEvaluationList
        history={history}
        headers={headers}
        sessions={evaluationPeriods}
      />
    </div>
  );

  return (
    <>
      <main className={classes.Container}>
        <HeadlineContainer
          headlineTitle={t('registration.reeval.banner.title')}
          headlineContent={
            <>
              <p>{t('registration.reeval.banner.text1')}</p>
              <p>{t('registration.reeval.banner.text2')}</p>
            </>
          }
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

export default connectRedux(mapStateToProps, mapDispatchToProps)(ReEvaluation);
