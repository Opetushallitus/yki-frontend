import React from 'react';
import { useTranslation } from 'react-i18next';

import YkiImage2 from '../../../assets/images/ophYki_image2.png';
import { MOBILE_VIEW } from '../../../common/Constants';
import { getDeviceOrientation } from '../../../util/util';
import HeadlineContainer from '../../HeadlineContainer/HeadlineContainer';
import classes from './ReEvaluationForm.module.css';

const ReEvaluationForm = ({ history, match }) => {
  const examId = match.params.id;
  const { t } = useTranslation();

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
          <>MOBIILI</>
        ) : (
          <>DESKTOP</>
        )}
      </main>
    </>
  );
};

export default ReEvaluationForm;
