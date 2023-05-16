import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { connect as connectRedux } from 'react-redux';

import YkiImage2 from '../../../assets/images/ophYki_image2.png';
import {
  fetchPrices,
  fetchReEvaluationPeriods,
} from '../../../store/actions/index';
import { useMobileView } from '../../../util/customHooks';
import { evaluationTexts, formatPriceObject } from '../../../util/util';
import HeadlineContainer from '../../HeadlineContainer/HeadlineContainer';
import PriceContainer from '../../PriceContainer/PriceContainer';
import ReEvaluationList from '../ReEvaluationList/ReEvaluationList';
import classes from './ReEvaluation.module.css';

const headers = [
  { title: 'common.exam', key: 'language_code', sortable: true },
  { title: 'common.testDay', key: 'exam_date', sortable: true },
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
    onFetchPrices: () => dispatch(fetchPrices()),
  };
};

const ReEvaluation = ({
  history,
  prices,
  evaluationPeriods,
  onFetchEvaluationPeriods,
  onFetchPrices,
  loadingPrices,
}) => {
  const { t } = useTranslation();
  const isMobile = useMobileView(true);

  useEffect(() => {
    onFetchEvaluationPeriods();
    Object.keys(prices).length === 0 && !loadingPrices && onFetchPrices();
  }, []);

  const evalPrices = prices && prices['evaluation-prices'];

  const evaluationPrices = formatPriceObject(evalPrices, evaluationTexts);

  const desktopContent = (
    <>
      <div style={{ display: 'flex', paddingBottom: '1rem' }}>
        <div style={{ marginRight: '1rem' }}>
          <article className={classes.ArticleContent}>
            <h2>{t('registration.reeval.heading1')}</h2>
            <p>{t('registration.reeval.text1')}</p>
            <p>{t('registration.reeval.text2')}</p>
            <h2 style={{ marginTop: '2rem' }}>{t('registration.reeval.heading2')}</h2>
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
    </>
  );

  const mobileContent = (
    <div style={{ width: `calc(${window.screen.availWidth}px - 20px)` }}>
      <article className={classes.ArticleContent}>
        <h2>{t('registration.reeval.heading1')}</h2>
        <p>{t('registration.reeval.text1')}</p>
        <p>{t('registration.reeval.text2')}</p>
        <h2 style={{ marginTop: '2rem' }}>{t('registration.reeval.heading2')}</h2>
        <p>{t('registration.reeval.text3')}</p>
        <p>{t('registration.reeval.text4')}</p>
        <p>{t('registration.reeval.text5')}</p>
        <p>{t('registration.reeval.text6')}</p>
      </article>
      <PriceContainer elements={evaluationPrices} />
      <ReEvaluationList
        history={history}
        headers={headers}
        sessions={evaluationPeriods}
      />
    </div>
  );

  return (
    <>
      <main id="main" className={'Container'}>
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
        <div className={'InnerContainer'}>
          {isMobile ? <>{mobileContent}</> : <>{desktopContent}</>}
        </div>
      </main>
    </>
  );
};

export default connectRedux(mapStateToProps, mapDispatchToProps)(ReEvaluation);
