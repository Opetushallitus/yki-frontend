import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import classes from './RegistrationSuccess.module.css';
import ExamDetailsCard from '../ExamDetailsPage/ExamDetailsCard/ExamDetailsCard';
import YkiImage3 from "../../../assets/images/ophYki_image2.png";
import HeadlineContainer from "../../HeadlineContainer/HeadlineContainer";
import BackButton from "../BackButton/BackButton";
import { getLanguageAndLevel } from "../../../util/util";

export const registrationSuccess = ({ initData, formData, history, t }) => {
  return (
    <main>
      <HeadlineContainer
        headlineTitle={t('registration.success.header')}
        headlineContent={<ExamDetailsCard exam={initData.exam_session} isFull={false} successHeader />}
        headlineImage={YkiImage3}
      />
      <div className={classes.RegistrationSuccess}>
        <BackButton clicked={() => history && history.push('/yki/')} buttonText={t('errorBoundary.return')} />
        <div data-cy="registration-success">
          <p>{t('registration.success.info1')}: <b>{getLanguageAndLevel(initData.exam_session)}.</b></p>
        </div>
        <div>
          <p>
            {t('registration.success.info2')} {formData.email}
          </p>
        </div>
        <div data-cy={"success-details-extra"}>
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
  formData: PropTypes.object.isRequired,
};

export default withTranslation()(registrationSuccess);
