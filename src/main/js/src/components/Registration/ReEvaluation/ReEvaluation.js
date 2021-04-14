import React from 'react';
import { useTranslation } from 'react-i18next';

import YkiImage1 from '../../../assets/images/ophYki_image1.png';
import { MOBILE_VIEW } from '../../../common/Constants';
import { getDeviceOrientation, levelTranslations } from '../../../util/util';
import HeadlineContainer from '../../HeadlineContainer/HeadlineContainer';
import classes from './ReEvaluation.module.css';

const ReEvaluation = ({ history }) => {
  const { t } = useTranslation();

  const desktopContent = (
    <>
      <h1>DESKTOP</h1>
    </>
  );

  const mobileContent = (
    <>
      <h1>Mobile</h1>
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

export default ReEvaluation;
