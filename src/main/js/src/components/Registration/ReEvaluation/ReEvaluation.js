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
import * as i18nKeys from "../../../common/LocalizationKeys";

const headers = [
  { title: i18nKeys.registration_list_exam, key: 'language_code', sortable: true },
  { title: i18nKeys.registration_list_date, key: 'exam_date', sortable: true },
  {
    title: i18nKeys.registration_list_evalPossible,
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
            <p>{t(i18nKeys.registration_reeval_text2)}</p>
            <p>{t(i18nKeys.registration_reeval_text3)}</p>
            <p>{t(i18nKeys.registration_reeval_text4)}</p>
            <p>{t(i18nKeys.registration_reeval_text5)}</p>
            <p>{t(i18nKeys.registration_reeval_text6)}</p>
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
        <p>{t(i18nKeys.registration_reeval_text2)}</p>
        <p>{t(i18nKeys.registration_reeval_text3)}</p>
        <p>{t(i18nKeys.registration_reeval_text4)}</p>
        <p>{t(i18nKeys.registration_reeval_text5)}</p>
        <p>{t(i18nKeys.registration_reeval_text6)}</p>
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
          headlineTitle={t(i18nKeys.registration_reeval_banner_title)}
          headlineContent={
            <>
              <p>{t(i18nKeys.registration_reeval_banner_text1)}</p>
              <p>{t(i18nKeys.registration_reeval_banner_text2)}</p>
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
