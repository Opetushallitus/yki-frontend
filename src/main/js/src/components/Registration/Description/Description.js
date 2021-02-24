import React from 'react';
import {useTranslation} from 'react-i18next';

import HeadlineContainer from "../../HeadlineContainer/HeadlineContainer";
import DescriptionCollapsible from "../../DescriptionsCollapsible/DescriptionCollapsible";

import YkiImage1 from '../../../assets/images/ophYki_image1.png';

import classes from './Description.module.css';
import {getDeviceOrientation, levelTranslations} from "../../../util/util";
import PriceContainer from "../../PriceContainer/PriceContainer";
import {MOBILE_VIEW} from "../../../common/Constants";

const description = ({history}) => {
  const {t} = useTranslation();

  document.title = 'YKI';

  const basicLevel = [
    {
      languageLevel: 'A1',
      descriptionText: t('common.examLevel.description.a1'),
    },
    {
      languageLevel: 'A2',
      descriptionText: t('common.examLevel.description.a2')
    },
  ];
  const middleLevel = [
    {
      languageLevel: 'B1',
      descriptionText: t('common.examLevel.description.b1'),
    },
    {
      languageLevel: 'B2',
      descriptionText: t('common.examLevel.description.b2')
    }
  ];

  const upperLevel = [
    {
      languageLevel: 'C1',
      descriptionText: t('common.examLevel.description.c1')
    },
    {
      languageLevel: 'C2',
      descriptionText: t('common.examLevel.description.c2')
    }
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
        {/*{tutorialVideo}*/}
        <>
          <h2>{t('registration.description.examLevels')}</h2>
          <DescriptionCollapsible headerText={levelTranslations.PERUS} content={basicLevel}/>
          <DescriptionCollapsible headerText={levelTranslations.KESKI} content={middleLevel}/>
          <DescriptionCollapsible headerText={levelTranslations.YLIN} content={upperLevel}/>
        </>
        <>
          <button
              className={'YkiButton'}
              data-cy="continue-button"
              onClick={() => history.push(t('/ilmoittautuminen/valitse-tutkintotilaisuus'))}
              role="link"
              aria-label={t('registration.register')}
          >
            {t('registration.register')}
          </button>
        </>
      </div>
      <PriceContainer/>
    </>
  );

  const mobileContent = (
    <>
      <div className={classes.InnerContainer} style={{width: `calc(${window.screen.availWidth}px - 20px)`}}>
        <article className={classes.ArticleContent}>
          <p>{t('registration.description.text2')}</p>
          <p>{t('registration.description.text3')}</p>
          <p>{t('registration.description.text4')}</p>
        </article>
        {/*{tutorialVideo}*/}
        <div style={{width: `calc(${window.screen.availWidth}px - 20px)`, padding: '0 2px'}}>
          <h2>{t('registration.description.examLevels')}</h2>
          <DescriptionCollapsible headerText={levelTranslations.PERUS} content={basicLevel}/>
          <DescriptionCollapsible headerText={levelTranslations.KESKI} content={middleLevel}/>
          <DescriptionCollapsible headerText={levelTranslations.YLIN} content={upperLevel}/>
        </div>
      </div>
      <>
        <PriceContainer/>
        <button
          className={'YkiButton'}
          data-cy="continue-button"
          onClick={() => history.push(t('/ilmoittautuminen/valitse-tutkintotilaisuus'))}
          role="link"
        >
          {t('registration.register')}
        </button>
      </>
    </>
  )

  return (
    <>
      <main className={classes.Container}>
        <HeadlineContainer
          headlineTitle={t('registration.description.title')}
          headlineContent={<p>{t('registration.description.text1')}</p>}
          headlineImage={YkiImage1}
        />
        {MOBILE_VIEW || (MOBILE_VIEW && (getDeviceOrientation() === 'landscape')) ?
          <>
            {mobileContent}
          </>
          :
          <>
            {desktopContent}
          </>
        }
      </main>
    </>
  );
};

export default description;
