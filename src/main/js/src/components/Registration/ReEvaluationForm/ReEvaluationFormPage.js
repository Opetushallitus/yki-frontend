import React, { useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import YkiImage2 from '../../../assets/images/ophYki_image2.png';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import {
  evaluationFailReset,
  fetchPrices,
  fetchReEvaluationPeriod,
} from '../../../store/actions';
import {
  examLanguageAndLevel,
  formatDate,
} from '../../../util/examSessionUtil';
import { evaluationTexts, formatPriceObject } from '../../../util/util';
import HeadlineContainer from '../../HeadlineContainer/HeadlineContainer';
import ReEvaluationForm from './ReEvaluationForm';
import classes from './ReEvaluationFormPage.module.css';

const mapStateToProps = state => {
  return {
    prices: state.registration.prices,
    loadingPrices: state.registration.loadingPrices,
    evaluationPeriod: state.registration.evaluationPeriod,
    error: state.registration.error,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchEvaluationPeriod: examId =>
      dispatch(fetchReEvaluationPeriod(examId)),
    errorConfirmedHandler: () => dispatch(evaluationFailReset()),
    onFetchPrices: () => dispatch(fetchPrices()),
  };
};

const ReEvaluationFormPage = ({
  history,
  match,
  prices,
  error,
  onFetchEvaluationPeriod,
  evaluationPeriod,
  onFetchPrices,
  loadingPrices,
  t,
}) => {
  const examId = match.params.id;
  useEffect(() => {
    onFetchEvaluationPeriod(examId);
    Object.keys(prices).length === 0 && !loadingPrices && onFetchPrices();
  }, []);

  const langAndLvl = evaluationPeriod && examLanguageAndLevel(evaluationPeriod);
  const examDate =
    evaluationPeriod && formatDate(evaluationPeriod, 'exam_date');
  const evalPrices = prices && prices['evaluation-prices'];
  const evaluationPrices = formatPriceObject(evalPrices, evaluationTexts);

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
          <p style={{ marginTop: '2rem' }}>
            {t('registration.reeval.formpage.title1')}
          </p>
          <div className={classes.BasicInfoRow}>
            <p>{langAndLvl}</p>
            <p>{examDate}</p>
          </div>
          <ReEvaluationForm
            evaluationPrices={evaluationPrices}
            externalState={{ id: examId }}
            pageHistory={history}
          />
        </div>
      </main>
    </>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(withErrorHandler(ReEvaluationFormPage)));
