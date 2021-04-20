import React from 'react';
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

  const evaluationPrices = formatPriceObject(evalPrices, evaluationTexts);

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
          <h2>{t('registration.reeval.formpage.title2')}</h2>
          <div className={classes.InnerContainer}>
            {evaluationPrices.map(price => (
              <TextAndButton
                text1={price.title}
                text2={price.price}
                buttonLabel={t('registration.reeval.order')}
                onClick={console.log('clicked')}
              />
            ))}
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
