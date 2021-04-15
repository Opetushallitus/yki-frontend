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
      <ReEvaluationList />
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
