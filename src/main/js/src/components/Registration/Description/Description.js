import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import YkiImage1 from '../../../assets/images/ophYki_image1.png';
import { fetchPrices } from '../../../store/actions/index';
import { useMobileView } from '../../../util/customHooks';
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
import * as i18nKeys from "../../../common/LocalizationKeys";

const mapStateToProps = state => {
  return {
    prices: state.registration.prices,
    loadingPrices: state.registration.loadingPrices,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchPrices: () => dispatch(fetchPrices()),
  };
};

const description = ({ history, prices, onFetchPrices, loadingPrices }) => {
  const { t } = useTranslation();

  const isMobile = useMobileView(true);

  useEffect(() => {
    Object.keys(prices).length === 0 && !loadingPrices && onFetchPrices();
  }, []);

  const examPrices = prices && prices['exam-prices'];
  const evalPrices = prices && prices['evaluation-prices'];

  const levelPrices = formatPriceObject(examPrices, levelTranslations);

  const evaluationPrices = formatPriceObject(evalPrices, evaluationTexts);

  document.title = 'YKI';

  const basicLevel = [
    {
      languageLevel: 'A1',
      descriptionText: t(i18nKeys.common_examLevel_description_a1),
    },
    {
      languageLevel: 'A2',
      descriptionText: t(i18nKeys.common_examLevel_description_a2),
    },
  ];
  const middleLevel = [
    {
      languageLevel: 'B1',
      descriptionText: t(i18nKeys.common_examLevel_description_b1),
    },
    {
      languageLevel: 'B2',
      descriptionText: t(i18nKeys.common_examLevel_description_b2),
    },
  ];

  const upperLevel = [
    {
      languageLevel: 'C1',
      descriptionText: t(i18nKeys.common_examLevel_description_c1),
    },
    {
      languageLevel: 'C2',
      descriptionText: t(i18nKeys.common_examLevel_description_c2),
    },
  ];

  const tutorialVideo = (
    <div className={classes.TutorialVideo}>
      <iframe
        src="https://www.youtube-nocookie.com//embed/tRZidlUIzrc"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={t(i18nKeys.registration_tutorialVideo)}
        scrolling="no"
        width={'300'}
        height={'500'}
      />
    </div>
  );

  const registerButton = (
    <Link
      tabIndex={0}
      role="link"
      onKeyPress={() =>
        history.push('/ilmoittautuminen/valitse-tutkintotilaisuus')
      }
      to={{
        pathname: '/ilmoittautuminen/valitse-tutkintotilaisuus',
      }}
      className={'YkiButton'}
      data-cy="continue-button"
    >
      {t(i18nKeys.registration_register)}
    </Link>
  );

  const desktopContent = (
    <>
      <div className={'InnerContainer'}>
        <div style={{ display: 'flex' }}>
          <div style={{ marginRight: '1rem' }}>
            <article className={classes.ArticleContent}>
              <p>{t(i18nKeys.registration_description_text2)}</p>
              <p>{t(i18nKeys.registration_description_text3)}</p>
              <p>{t(i18nKeys.registration_description_text4)}</p>
            </article>
            {tutorialVideo}
          </div>
          <PriceContainer
            elements={levelPrices.concat({
              title: i18nKeys.common_price_reeval_first,
              price: '50',
              extraText: i18nKeys.common_price_reeval_last,
            })}
          />
        </div>
        <div>
          <h2>{t(i18nKeys.registration_description_examLevels)}</h2>
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
          <>{registerButton}</>

          <h2 style={{ marginTop: '4rem' }}>
            {t(i18nKeys.registration_description_reEvaluation)}
          </h2>
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
        <Link
          tabIndex={0}
          role="link"
          style={{ padding: '0.25rem 0.75rem' }}
          onKeyPress={() => history.push('/tarkistusarviointi')}
          to={{
            pathname: '/tarkistusarviointi',
          }}
          className={'YkiButton'}
          data-cy="continue-button-re-eval"
        >
          {t(i18nKeys.registration_reeval)}
        </Link>
      </div>
    </>
  );

  const mobileContent = (
    <div
      className={'InnerContainer'}
      style={{ width: `calc(${window.screen.availWidth}px - 20px)` }}
    >
      <article className={classes.ArticleContent}>
        <p>{t(i18nKeys.registration_description_text2)}</p>
        <p>{t(i18nKeys.registration_description_text3)}</p>
        <p>{t(i18nKeys.registration_description_text4)}</p>
      </article>
      {tutorialVideo}
      <div
        style={{
          width: `calc(${window.screen.availWidth}px - 20px)`,
          padding: '0 2px',
        }}
      >
        <h2>{t(i18nKeys.registration_description_examLevels)}</h2>
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

      <PriceContainer elements={levelPrices} />
      {registerButton}

      <div
        style={{
          width: `calc(${window.screen.availWidth}px - 20px)`,
          padding: '0 2px',
        }}
      >
        <h2 style={{ marginTop: '2rem', lineHeight: 'normal' }}>
          {t(i18nKeys.registration_description_reEvaluation)}
        </h2>
        {Object.keys(evaluationTexts).map(el => {
          return (
            <React.Fragment key={el}>
              <h3 className={classes.ReEvalHeader}>{t(evaluationTexts[el])}</h3>
              <hr />
            </React.Fragment>
          );
        })}

        <PriceContainer elements={evaluationPrices} />
        <Link
          tabIndex={0}
          role="link"
          onKeyPress={() => history.push('/tarkistusarviointi')}
          to={{
            pathname: '/tarkistusarviointi',
          }}
          className={'YkiButton'}
          data-cy="continue-button"
        >
          {t(i18nKeys.registration_reeval)}
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <main id="main" className={'Container'}>
        <HeadlineContainer
          headlineTitle={t(i18nKeys.registration_description_title)}
          headlineContent={<p>{t(i18nKeys.registration_description_text1)}</p>}
          headlineImage={YkiImage1}
        />
        {isMobile || (isMobile && getDeviceOrientation() === 'landscape') ? (
          <>{mobileContent}</>
        ) : (
          <>{desktopContent}</>
        )}
      </main>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(description);
