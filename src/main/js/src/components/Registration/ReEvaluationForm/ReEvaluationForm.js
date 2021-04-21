import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import YkiImage2 from '../../../assets/images/ophYki_image2.png';
import { DATE_FORMAT, MOBILE_VIEW } from '../../../common/Constants';
import {
  examLanguageAndLevel,
  formatDate,
} from '../../../util/examSessionUtil';
import { evaluationTexts, formatPriceObject } from '../../../util/util';
import HeadlineContainer from '../../HeadlineContainer/HeadlineContainer';
import TextAndButton from '../../TextAndButton/TextAndButton';
import classes from './ReEvaluationForm.module.css';

const session = {
  id: '1',
  exam_date: '2021-04-02',
  language_code: 'fin',
  level_code: 'KESKI',
  evaluation_start_date: '2021-04-01',
  evaluation_end_date: '2021-05-30',
  open: true,
};

const mapStateToProps = state => {
  return {
    prices: state.registration.prices,
  };
};

const ReEvaluationForm = ({ history, match, prices }) => {
  const examId = match.params.id;
  const { t } = useTranslation();
  const langAndLvl = examLanguageAndLevel(session);
  const examDate = formatDate(session, 'exam_date');
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
      <main className={classes.Container}>
        <HeadlineContainer
          headlineTitle={t('registration.reeval.title')}
          headlineContent={<p>{t('registration.reeval.text1')}</p>}
          headlineImage={YkiImage2}
        />
        <div className={classes.MainContent}>
          <div className={classes.InnerContainer}>
            <h2>{t('registration.reeval.formpage.title1')}</h2>
            <div className={classes.BasicInfoRow}>
              <p>{langAndLvl}</p>
              <p>{examDate}</p>
            </div>
          </div>
          <div className={classes.InnerContainer}>
            <h2>{t('registration.reeval.formpage.title2')}</h2>
            {evaluationPrices.map(price => {
              return priceElement(price);
            })}
            <div className={classes.Total}>
              <strong>{t('registration.reeval.total')}:</strong>
              <strong>{calculatePrice()} €</strong>
            </div>
            <p>{t('registration.reeval.formpage.text')}</p>
          </div>
          <h2>{t('registration.reeval.formpage.title3')}</h2>
          <button
            role="link"
            className="YkiButton"
            style={{
              padding: '0.25rem',
            }}
          >
            {t('registration.reeval.formpage.button')}
          </button>
        </div>
      </main>
    </>
  );
};

export default connect(mapStateToProps)(ReEvaluationForm);
