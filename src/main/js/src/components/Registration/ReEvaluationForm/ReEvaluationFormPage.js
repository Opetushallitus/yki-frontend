import React, { useEffect, useState } from 'react';
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
import TextAndButton from '../../TextAndButton/TextAndButton';
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
  const [subtests, setSubtests] = useState([]);
  const evaluationPrices = formatPriceObject(evalPrices, evaluationTexts);

  const toggleSelect = key => {
    const subtestsCopy = subtests.slice();
    const foundIndex = subtestsCopy.findIndex(x => x === key);
    if (foundIndex !== -1) {
      subtestsCopy.splice(foundIndex, 1);
    } else {
      subtestsCopy.push(key);
    }
    setSubtests(subtestsCopy);
  };

  const priceElement = price => {
    const active = subtests.findIndex(x => x === price.key) > -1;
    return (
      <React.Fragment key={price.key}>
        <TextAndButton
          text1={price.title}
          text2={`${price.price} €`}
          elementKey={price.key}
          active={active}
          buttonLabel={t('registration.reeval.order')}
          onClick={() => toggleSelect(price.key)}
        />
      </React.Fragment>
    );
  };

  const calculatePrice = () => {
    let total = 0;
    if (subtests.length > 0) {
      subtests.forEach(subtest => {
        const item = evaluationPrices.find(x => x.key === subtest);
        total += item.price;
      });
    }
    return total;
  };

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
          <h2 style={{ marginTop: '2rem' }}>
            {t('registration.reeval.formpage.title1')}
          </h2>
          <div className={classes.BasicInfoRow}>
            <p>{langAndLvl}</p>
            <p>{examDate}</p>
          </div>
          <h2>{t('registration.reeval.formpage.title2')}</h2>
          {evaluationPrices.map(price => {
            return priceElement(price);
          })}
          <div className={classes.Total}>
            <strong>{t('registration.reeval.total')}:</strong>
            <strong data-cy="reeval-subtest-total">{calculatePrice()} €</strong>
          </div>
          <p>{t('registration.reeval.formpage.text')}</p>

          <div>
            <h2>{t('registration.reeval.formpage.title3')}</h2>
            <ReEvaluationForm
              externalState={{ id: examId, subtests }}
              pageHistory={history}
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(withErrorHandler(ReEvaluationFormPage)));
