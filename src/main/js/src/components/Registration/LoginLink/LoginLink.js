import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from '../../../axios';
import * as Yup from 'yup';
import { withTranslation } from 'react-i18next';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import classes from './LoginLink.module.css';
import Button from '../../../components/UI/Button/Button';
import Alert from '../../../components/Alert/Alert';
import * as i18nKeys from "../../../common/LocalizationKeys";

export class LoginLink extends Component {
  state = {
    submitted: false,
    email: null,
  };

  render() {
    const submit = payload => {
      return axios.post('/yki/api/login-link', payload);
    };

    return !this.state.submitted ? (
      <Formik
        initialValues={{ email: '' }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .required(this.props.t(i18nKeys.error_mandatory))
            .email(this.props.t(i18nKeys.error_email)),
        })}
        onSubmit={(values, { setSubmitting, setStatus }) => {
          submit({
            email: values.email,
            exam_session_id: this.props.examSessionId,
          })
            .then(() => {
              setSubmitting(false);
              setStatus(null);
              this.setState({ submitted: true, email: values.email });
            })
            .catch(err => {
              setSubmitting(false);
              setStatus(err);
            });
        }}
      >
        {({ isSubmitting, status, isValid }) => (
          <Form className={classes.Form}>
            <label htmlFor="email" className={classes.Label}>
              {this.props.t(i18nKeys.registration_loginlink_header)}
            </label>
            <div className={classes.FormElement}>
              <Field
                type="email"
                name="email"
                className={classes.TextInput}
                data-cy="input-email"
              />
              <ErrorMessage
                name="email"
                component="span"
                className={classes.ValidationError}
              />
            </div>
            <Button
              type="submit"
              isRegistration={true}
              disabled={!isValid || isSubmitting}
              datacy="button-loginlink-form-submit"
            >
              {this.props.t(i18nKeys.registration_notification_signup_button)}
            </Button>
            {!!status && (
              <div className={classes.SubmitError}>
                <Alert
                  title={this.props.t(i18nKeys.error_email_sendFailed)}
                  optionalText={this.props.t(i18nKeys.error_generic_info)}
                />
              </div>
            )}
          </Form>
        )}
      </Formik>
    ) : (
      <>
        <p data-cy="loginlink-success">
          {this.props.t(i18nKeys.registration_loginlink_success)}{' '}
          <strong>{this.state.email}</strong>
        </p>
      </>
    );
  }
}

LoginLink.propTypes = {
  examSessionId: PropTypes.number.isRequired,
};

export default withTranslation()(LoginLink);
