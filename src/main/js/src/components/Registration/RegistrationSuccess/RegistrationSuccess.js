import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';

import YkiImage3 from '../../../assets/images/ophYki_image2.png';
import { getLanguageAndLevel } from '../../../util/util';
import HeadlineContainer from '../../HeadlineContainer/HeadlineContainer';
import BackButton from '../BackButton/BackButton';
import ExamDetailsCard from '../ExamDetailsPage/ExamDetailsCard/ExamDetailsCard';
import classes from './RegistrationSuccess.module.css';

export const registrationSuccess = ({ initData, t }) => {
  return (
    <main id="main">
      <HeadlineContainer
        headlineTitle={t('registration.success.header')}
        headlineContent={
          <ExamDetailsCard exam={initData.exam_session} isFull={false} showExam={true} />
        }
        headlineImage={YkiImage3}
      />
      <div className={classes.RegistrationSuccess}>
        <BackButton href="/yki/" buttonText={t('errorBoundary.return')} />
        <div data-cy="registration-success">
          <p>
            {t('registration.success.info1')}:{' '}
            <b>{getLanguageAndLevel(initData.exam_session)}.</b>
          </p>
        </div>
        <div>
          <p>{t('registration.success.info2')}</p>
        </div>
        <div data-cy={'success-details-extra'}>
          <p>
            <b>{t('registration.success.info3')}</b>{' '}
            {t('registration.success.info4')}
          </p>
        </div>
      </div>
    </main>
  );
};

registrationSuccess.propTypes = {
  initData: PropTypes.object.isRequired,
};

export default withTranslation()(registrationSuccess);
