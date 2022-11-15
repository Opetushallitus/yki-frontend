import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';

import axios from '../../axios';
import Alert from '../../components/Alert/Alert';
import classes from './OldPaymentRedirect.module.css';

export class OldPaymentRedirect extends Component {
  paymentForm = React.createRef();

  state = {
    formData: null,
    error: false,
  };

  componentDidMount = () => {
    const {
      match: { params },
    } = this.props;
    axios
      .get(`/yki/payment/formdata?registration-id=${params.registrationId}`)
      .then(({ data }) => {
        this.setState({ formData: data });
      })
      .catch(err => {
        this.setState({ error: true });
      });
  };

  componentDidUpdate = () => {
    if (this.state.formData) {
      this.paymentForm.current.submit();
    }
  };

  render() {
    return this.state.formData && !this.state.error ? (
      <form
        ref={this.paymentForm}
        action={this.state.formData.uri}
        method="POST"
        acceptCharset="ISO-8859-1"
      >
        {this.state.formData.params.PARAMS_IN.split(',').map((p, i) => {
          return (
            <input
              key={i}
              name={p}
              type="hidden"
              value={this.state.formData.params[p]}
            />
          );
        })}
        <input
          name="AUTHCODE"
          type="hidden"
          value={this.state.formData.params.AUTHCODE}
        />
      </form>
    ) : (
      this.state.error && (
        <>
          <main id="main" className={classes.Content}>
            <Alert
              title={this.props.t('payment.redirect.error')}
              optionalText={this.props.t('payment.redirect.error.info')}
            />
          </main>
        </>
      )
    );
  }
}

OldPaymentRedirect.propTypes = {
  match: PropTypes.object.isRequired,
};

export default withTranslation()(OldPaymentRedirect);
