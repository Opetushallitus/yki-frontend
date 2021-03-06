import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import YkiImage1 from '../../../assets/images/ophYki_image1.png';
import { MOBILE_VIEW } from '../../../common/Constants';
import {
  evaluationTexts,
  formatPriceObject,
  getDeviceOrientation,
  levelTranslations,
} from '../../../util/util';
import DescriptionCollapsible from '../../DescriptionsCollapsible/DescriptionCollapsible';
import HeadlineContainer from '../../HeadlineContainer/HeadlineContainer';
import PriceContainer from '../../PriceContainer/PriceContainer';
import classes from './Description.module.css';
import { fetchPrices } from '../../../store/actions/index';

const mapStateToProps = state => {
  return {
    prices: state.registration.prices,
    loadingPrices: state.registration.loadingPrices
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchPrices: () => dispatch(fetchPrices()),
  };
};

const description = ({ history, prices, onFetchPrices, loadingPrices }) => {
  const { t } = useTranslation();

  useEffect(() => {
    Object.keys(prices).length === 0 && !loadingPrices && onFetchPrices()
  }, [])

  const examPrices = prices && prices['exam-prices'];
  const evalPrices = prices && prices['evaluation-prices'];

  const levelPrices = formatPriceObject(examPrices, levelTranslations);

  const evaluationPrices = formatPriceObject(evalPrices, evaluationTexts);

  document.title = 'YKI';

  const basicLevel = [
    {
      languageLevel: 'A1',
      descriptionText: t('common.examLevel.description.a1'),
    },
    {
      languageLevel: 'A2',
      descriptionText: t('common.examLevel.description.a2'),
    },
  ];
  const middleLevel = [
    {
      languageLevel: 'B1',
      descriptionText: t('common.examLevel.description.b1'),
    },
    {
      languageLevel: 'B2',
      descriptionText: t('common.examLevel.description.b2'),
    },
  ];

  const upperLevel = [
    {
      languageLevel: 'C1',
      descriptionText: t('common.examLevel.description.c1'),
    },
    {
      languageLevel: 'C2',
      descriptionText: t('common.examLevel.description.c2'),
    },
  ];

  const tutorialVideo = (
    <div className={classes.TutorialVideo}>
      <iframe
        src="https://www.youtube-nocookie.com//embed/tRZidlUIzrc"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={t('registration.tutorialVideo')}
        scrolling="no"
        width={'300'}
        height={'500'}
      />
    </div>
  );

  const desktopContent = (
    <>
      <div className={classes.InnerContainer}>
        <article className={classes.ArticleContent}>
          <p>{t('registration.description.text2')}</p>
          <p>{t('registration.description.text3')}</p>
          <p>{t('registration.description.text4')}</p>
        </article>
        {tutorialVideo}
        <>
          <h2>{t('registration.description.examLevels')}</h2>
          <DescriptionCollapsible
            headerText={levelTranslations.PERUS}
            content={basicLevel}
          />
          <DescriptionCollapsible
            headerText={levelTranslations.KESKI}
            content={middleLevel}
          />
          <DescriptionCollapsible
            headerText={levelTranslations.YLIN}
            content={upperLevel}
          />
        </>
        <>
          <button
            className={'YkiButton'}
            data-cy="continue-button"
            onClick={() =>
              history.push(t('/ilmoittautuminen/valitse-tutkintotilaisuus'))
            }
            role="link"
            aria-label={t('registration.register')}
          >
            {t('registration.register')}
          </button>
        </>
        <div className={classes.InnerContainer}>
          <h2>{t('registration.description.reEvaluation')}</h2>
          {Object.keys(evaluationTexts).map(el => {
            return (
              <React.Fragment key={el}>
                <h3 className={classes.ReEvalHeader}>
                  {t(evaluationTexts[el])}
                </h3>
                <hr />
              </React.Fragment>
            );
          })}
        </div>
        <>
          <button
            className={'YkiButton'}
            style={{ width: 'auto', padding: '0 1rem' }}
            data-cy="re-eval-button"
            onClick={() => history.push(t('/tarkistusarviointi'))}
            role="link"
            aria-label={t('registration.reeval')}
          >
            {t('registration.reeval')}
          </button>
        </>
      </div>
      <PriceContainer
        elements={levelPrices.concat({
          title: 'common.price.reeval.first',
          price: '50',
          extraText: 'common.price.reeval.last',
        })}
      />
    </>
  );

  const mobileContent = (
    <>
      <div
        className={classes.InnerContainer}
        style={{ width: `calc(${window.screen.availWidth}px - 20px)` }}
      >
        <article className={classes.ArticleContent}>
          <p>{t('registration.description.text2')}</p>
          <p>{t('registration.description.text3')}</p>
          <p>{t('registration.description.text4')}</p>
        </article>
        {tutorialVideo}
        <div
          style={{
            width: `calc(${window.screen.availWidth}px - 20px)`,
            padding: '0 2px',
          }}
        >
          <h2>{t('registration.description.examLevels')}</h2>
          <DescriptionCollapsible
            headerText={levelTranslations.PERUS}
            content={basicLevel}
          />
          <DescriptionCollapsible
            headerText={levelTranslations.KESKI}
            content={middleLevel}
          />
          <DescriptionCollapsible
            headerText={levelTranslations.YLIN}
            content={upperLevel}
          />
        </div>
      </div>
      <>
        <PriceContainer elements={levelPrices} />
        <button
          className={'YkiButton'}
          data-cy="continue-button"
          onClick={() =>
            history.push(t('/ilmoittautuminen/valitse-tutkintotilaisuus'))
          }
          role="link"
        >
          {t('registration.register')}
        </button>
      </>
      <div
        className={classes.InnerContainer}
        style={{
          width: `calc(${window.screen.availWidth}px - 20px)`,
          padding: '1rem',
        }}
      >
        <h2>{t('registration.description.reEvaluation')}</h2>
        {Object.keys(evaluationTexts).map(el => {
          return (
            <React.Fragment key={el}>
              <h3 className={classes.ReEvalHeader}>{t(evaluationTexts[el])}</h3>
              <hr />
            </React.Fragment>
          );
        })}
        <div style={{ margin: '2rem 0 0 0' }}>
          <PriceContainer elements={evaluationPrices} />
          <button
            className={'YkiButton'}
            style={{ width: 'auto', padding: '0 1rem' }}
            data-cy="re-eval-button"
            onClick={() => history.push(t('/tarkistusarviointi'))}
            role="link"
            aria-label={t('registration.reeval')}
          >
            {t('registration.reeval')}
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <main className={classes.Container}>
        <HeadlineContainer
          headlineTitle={t('registration.description.title')}
          headlineContent={<p>{t('registration.description.text1')}</p>}
          headlineImage={YkiImage1}
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

export default connect(mapStateToProps, mapDispatchToProps)(description);
