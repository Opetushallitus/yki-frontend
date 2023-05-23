import { ErrorMessage, Field, Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import axios from '../../../axios';
import { useMobileView } from '../../../util/customHooks';
import Alert from '../../Alert/Alert';
import Button from '../../UI/Button/Button';
import classes from './NotificationSignup.module.css';

const notificationSignup = ({ examSessionId }) => {
  const [t] = useTranslation();
  const [signup, updateSignup] = useState({});
  const mobileOrTablet = useMobileView(true, true);

  const submitPost = (email, setStatus) => {
    axios
      .post(`/yki/api/exam-session/${examSessionId}/queue`, {
        email: email,
      })
      .then(res => {
        setStatus(null);
        updateSignup({ ...res.data, email: email });
      })
      .catch(error => {
        setStatus(error.response);
      });
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email(t('registration.notification.signup.validation'))
      .required(t('error.mandatory')),
    confirmEmail: Yup.string()
      .oneOf([Yup.ref('email'), null], t('error.confirmEmail'))
      .required(t('registration.form.confirmEmail')),
  });

  return (
    <>
      {signup.success ? (
        <p>
          {t('registration.notification.signup.complete')}{' '}
          <strong>{signup.email}</strong>
          {t('registration.notification.signup.complete2')}
        </p>
      ) : (
        <Formik
          initialValues={{ email: '', confirmEmail: '' }}
          validationSchema={validationSchema}
          onSubmit={(values, { setStatus }) => {
            submitPost(values.email, setStatus);
          }}
          render={({ isValid, status }) => (
            <Form className={classes.Form}>
              <p>{t('registration.notifySignup.text1')}</p>
              <p>{t('registration.notifySignup.text2')}</p>
              <div className={classes.EmailContainer}>
                <div>
                  <label htmlFor="email" className={classes.BoldLabel}>
                    {t('registration.form.email')} *
                  </label>
                  <Field
                    className={classes.Field}
                    type="input"
                    id="email"
                    name="email"
                    aria-required
                    placeholder="essi@esimerkki.fi"
                  />
                </div>
                <div>
                  <label htmlFor="confirmEmail" className={classes.BoldLabel}>
                    {t('registration.form.confirmEmail')} *
                  </label>
                  <Field
                    className={classes.Field}
                    type="input"
                    aria-required
                    id="confirmEmail"
                    name="confirmEmail"
                    placeholder="essi@esimerkki.fi"
                  />
                </div>
              </div>
              <ErrorMessage
                name="email"
                component="span"
                className={classes.ErrorMessage}
              />
              <ErrorMessage
                name="confirmEmail"
                component="span"
                className={classes.ErrorMessage}
              />
              {mobileOrTablet ? (
                <Button
                  type="submit"
                  disabled={!isValid}
                  datacy="registry-item-form-submit"
                  isRegistration
                >
                  {t('registration.notification.signup.button')}
                </Button>
              ) : (
                <div style={{ width: '260px' }}>
                  <Button
                    type="submit"
                    disabled={!isValid}
                    datacy="registry-item-form-submit"
                    isRegistration
                  >
                    {t('registration.notification.signup.button')}
                  </Button>
                </div>
              )}
              {!!status && (
                <Alert
                  title={
                    status.status === 409
                      ? t('error.emailAlreaydInQueue')
                      : t('error.common')
                  }
                />
              )}
            </Form>
          )}
        />
      )}
    </>
  );
};

notificationSignup.propTypes = {
  examSessionId: PropTypes.string.isRequired,
};

export default notificationSignup;
