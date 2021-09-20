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
import * as i18nKeys from "../../../common/LocalizationKeys";

const notificationSignup = ({ examSessionId, registrationOpen }) => {
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
      .email(t(i18nKeys.registration_notification_signup_validation))
      .required(t(i18nKeys.error_mandatory)),
    confirmEmail: Yup.string()
      .oneOf([Yup.ref('email'), null], t(i18nKeys.error_confirmEmail))
      .required(t(i18nKeys.registration_form_confirmEmail)),
  });

  return (
    <>
      {signup.success ? (
        <p>
          {t(i18nKeys.registration_notification_signup_complete)}{' '}
          <strong>{signup.email}</strong>
          {t(i18nKeys.registration_notification_signup_complete2)}
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
              {registrationOpen === false ? (
                <h2>{t(i18nKeys.registration_form_header_notifyWhenOpen)}</h2>
              ) : (
                <h2>{t(i18nKeys.registration_form_header_notify)}</h2>
              )}
              <div className={classes.EmailContainer}>
                <div>
                  <label htmlFor="email" className={classes.BoldLabel}>
                    {t(i18nKeys.registration_form_email)}
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
                    {t(i18nKeys.registration_form_confirmEmail)}
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
                  {t(i18nKeys.registration_notification_signup_button)}
                </Button>
              ) : (
                <div style={{ width: '260px' }}>
                  <Button
                    type="submit"
                    disabled={!isValid}
                    datacy="registry-item-form-submit"
                    isRegistration
                  >
                    {t(i18nKeys.registration_notification_signup_button)}
                  </Button>
                </div>
              )}
              {!!status && (
                <Alert
                  title={
                    status.status === 409
                      ? t(i18nKeys.error_emailAlreaydInQueue)
                      : t(i18nKeys.error_common)
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
