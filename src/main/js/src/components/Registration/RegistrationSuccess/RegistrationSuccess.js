import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import classes from './RegistrationSuccess.module.css';
import Hyperlink from '../../UI/Hyperlink/Hyperlink';
import ExamDetailsCard from '../ExamDetailsPage/ExamDetailsCard/ExamDetailsCard';

export const registrationSuccess = ({ initData, formData, t }) => {
  return (
    <div className={classes.RegistrationSuccess}>
      <div>
        <h1 data-cy="registration-success-header">
          {t('registration.success.header')}
        </h1>
        <p>{t('registration.success.info1')}:</p>
        <ExamDetailsCard exam={initData.exam_session} isFull={false} />
      </div>
      <div>
        <p>
          {t('registration.success.info2')} {formData.email}
        </p>
      </div>
      <div className={classes.InfoBox}>
        <p>
          <b>{t('registration.success.info3')}</b>{' '}
          {t('registration.success.info4')}
        </p>
      </div>
      <div className={classes.BackButton}>
        <Hyperlink to={'/yki/'} text={t('errorBoundary.return')} />
      </div>
    </div>
  );
};

registrationSuccess.propTypes = {
  initData: PropTypes.object.isRequired,
  formData: PropTypes.object.isRequired,
};

export default withTranslation()(registrationSuccess);
