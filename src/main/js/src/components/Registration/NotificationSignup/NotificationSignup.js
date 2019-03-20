import React, { useState, Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import PropTypes from 'prop-types';

import classes from './NotificationSignup.module.css';
import Button from '../../UI/Button/Button';

const notificationSignup = ({ examSessionId }) => {
  const [t] = useTranslation();
  const [signup, updateSignup] = useState({});

  const submitPost = email => {
    axios
      .post(`/yki/api/exam-session/${examSessionId}/queue`, {
        email: email,
      })
      .then(res => {
        updateSignup({ ...res.data, email: email });
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
          onSubmit={values => {
            submitPost(values.email);
          }}
          render={({ isValid }) => (
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
                tabIndex="1"
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
                tabIndex="2"
                datacy="registry-item-form-submit"
                isRegistration
              >
                {t('registration.notification.signup.button')}
              </Button>
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
