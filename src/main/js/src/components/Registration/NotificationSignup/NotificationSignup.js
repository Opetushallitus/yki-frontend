import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import * as Yup from 'yup';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import PropTypes from 'prop-types';

import classes from './NotificationSignup.module.css';
import Button from '../../UI/Button/Button';
import axios from '../../../axios';
import Alert from '../../Alert/Alert';
import {MOBILE_VIEW, TABLET_VIEW} from "../../../common/Constants";

const notificationSignup = ({examSessionId}) => {
  const [t] = useTranslation();
  const [signup, updateSignup] = useState({});

  const submitPost = (email, setStatus) => {
    axios
        .post(`/yki/api/exam-session/${examSessionId}/queue`, {
          email: email,
        })
        .then(res => {
          setStatus(null);
          updateSignup({...res.data, email: email});
        })
        .catch(error => {
          setStatus(error.response);
        });
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email(t('registration.notification.signup.validation')),
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
                initialValues={{email: '', confirmEmail: ''}}
                validationSchema={validationSchema}
                onSubmit={(values, {setStatus}) => {
                  submitPost(values.email, setStatus);
                }}
                render={({isValid, status}) => (
                    <Form className={classes.Form}>
                      <h2>{t('registration.form.header.notify')}</h2>
                      <div className={classes.EmailContainer}>
                        <div>
                          <label htmlFor="email" className={classes.BoldLabel}>
                            {t('registration.form.email')}
                          </label>
                          <Field
                              className={classes.Field}
                              type="input"
                              id="email"
                              name="email"
                              placeholder="essi@esimerkki.fi"
                              autoFocus
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className={classes.BoldLabel}>
                            {t('registration.form.confirmEmail')}
                          </label>
                          <Field
                              className={classes.Field}
                              type="input"
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
                      {MOBILE_VIEW || TABLET_VIEW ?
                          <Button
                              type="submit"
                              disabled={!isValid}
                              datacy="registry-item-form-submit"
                              isRegistration
                          >
                            {t('registration.notification.signup.button')}
                          </Button>
                          :
                          <div style={{width: '260px'}}>
                            <Button
                                type="submit"
                                disabled={!isValid}
                                datacy="registry-item-form-submit"
                                isRegistration
                            >
                              {t('registration.notification.signup.button')}
                            </Button>
                          </div>
                      }
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
