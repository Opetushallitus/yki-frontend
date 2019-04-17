import React, { useState, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import PropTypes from 'prop-types';

import classes from './NotificationSignup.module.css';
import Button from '../../UI/Button/Button';
import axios from '../../../axios';
import Alert from '../../Alert/Alert';

const notificationSignup = ({ examSessionId }) => {
  const [t] = useTranslation();
  const [signup, updateSignup] = useState({});

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
    email: Yup.string().email(t('registration.notification.signup.validation')),
  });

  return (
    <Fragment>
      {signup.success ? (
        <p>
          {t('registration.notification.signup.complete')}{' '}
          <strong>{signup.email}</strong>
          {t('registration.notification.signup.complete2')}
        </p>
      ) : (
        <Formik
          initialValues={{ email: '' }}
          validationSchema={validationSchema}
          onSubmit={(values, { setStatus }) => {
            submitPost(values.email, setStatus);
          }}
          render={({ isValid, status }) => (
            <Form className={classes.Form}>
              <label htmlFor="email" className={classes.Label}>
                {t('registration.notification.signup.label')}
              </label>

              <Field
                className={classes.Field}
                type="input"
                id="email"
                name="email"
                placeholder="essi@esimerkki.fi"
                autoFocus
              />
              <ErrorMessage
                name="email"
                component="span"
                className={classes.ErrorMessage}
              />
              <Button
                type="submit"
                disabled={!isValid}
                datacy="registry-item-form-submit"
                isRegistration
              >
                {t('registration.notification.signup.button')}
              </Button>
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
    </Fragment>
  );
};

notificationSignup.propTypes = {
  examSessionId: PropTypes.string.isRequired,
};

export default notificationSignup;
