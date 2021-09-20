import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';

import YkiImage3 from '../../../assets/images/ophYki_image2.png';
import { getLanguageAndLevel } from '../../../util/util';
import HeadlineContainer from '../../HeadlineContainer/HeadlineContainer';
import BackButton from '../BackButton/BackButton';
import ExamDetailsCard from '../ExamDetailsPage/ExamDetailsCard/ExamDetailsCard';
import classes from './RegistrationSuccess.module.css';
import * as i18nKeys from "../../../common/LocalizationKeys";

export const registrationSuccess = ({ initData, formData, history, t }) => {
  return (
    <main id="main">
      <HeadlineContainer
        headlineTitle={t(i18nKeys.registration_success_header)}
        headlineContent={
          <ExamDetailsCard
            exam={initData.exam_session}
            isFull={false}
            successHeader
          />
        }
        headlineImage={YkiImage3}
      />
      <div className={classes.RegistrationSuccess}>
        <BackButton href="/yki/" buttonText={t(i18nKeys.errorBoundary_return)} />
        <div data-cy="registration-success">
          <p>
            {t(i18nKeys.registration_success_info1)}:{' '}
            <b>{getLanguageAndLevel(initData.exam_session)}.</b>
          </p>
        </div>
        <div>
          <p>
            {t(i18nKeys.registration_success_info2)} {formData.email}
          </p>
        </div>
        <div data-cy={'success-details-extra'}>
          <p>
            <b>{t(i18nKeys.registration_success_info3)}</b>{' '}
            {t(i18nKeys.registration_success_info4)}
          </p>
        </div>
      </div>
    </main>
  );
};

registrationSuccess.propTypes = {
  initData: PropTypes.object.isRequired,
  formData: PropTypes.object.isRequired,
};

export default withTranslation()(registrationSuccess);
