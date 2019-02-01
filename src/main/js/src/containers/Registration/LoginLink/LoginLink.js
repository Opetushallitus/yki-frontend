import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from '../../../axios';
import * as Yup from 'yup';
import { withNamespaces } from 'react-i18next';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import classes from './LoginLink.module.css';
import Button from '../../../components/UI/Button/Button';
import Alert from '../../../components/Alert/Alert';

export class LoginLink extends Component {
  state = {
    submitted: false,
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
            .required(this.props.t('error.mandatory'))
            .email(this.props.t('error.email')),
        })}
        onSubmit={(values, { setSubmitting, setStatus }) => {
          submit({
            email: values.email,
            exam_session_id: this.props.examSessionId,
          })
            .then(() => {
              setSubmitting(false);
              setStatus(null);
              this.setState({ submitted: true });
            })
            .catch(err => {
              setSubmitting(false);
              setStatus(err);
            });
        }}
      >
        {({ isSubmitting, status, isValid }) => (
          <Form className={classes.Form}>
           {!!status && <Alert title={this.props.t('error.email.sendFailed')} optionalText={this.props.t('error.generic.info')}/>}
            <h3>{this.props.t('registration.loginlink.header')}</h3>
            <div className={classes.FormElement}>
              <Field type="email" name="email" className={classes.TextInput} />
              <ErrorMessage name="email" component="span" />
            </div>
            <Button
              type="submit"
              isRegistration={true}
              disabled={!isValid || isSubmitting}
            >
              {this.props.t('examSession.addButton')}
            </Button>
          </Form>
        )}
      </Formik>
    ) : (
      <React.Fragment>
        <p>{this.props.t('registration.loginlink.success')}</p>
      </React.Fragment>
    );
  }
}

LoginLink.propTypes = {
  examSessionId: PropTypes.number.isRequired,
};

export default withNamespaces()(LoginLink);
