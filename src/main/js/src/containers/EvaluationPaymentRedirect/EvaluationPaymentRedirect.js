import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from '../../axios';
import { withTranslation } from 'react-i18next';

import Alert from '../../components/Alert/Alert';
import classes from './EvaluationPaymentRedirect.module.css';

export class PaymentRedirect extends Component {
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
      .get(`/yki/evaluation-payment/formdata?evaluation-order-id=${params.evaluationOrderId}`)
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
    const { formData } = this.state;
    return formData && !this.state.error ? (
      <form
        ref={this.paymentForm}
        action={formData.uri}
        method="POST"
        acceptCharset="ISO-8859-1"
      >
        {formData.params.PARAMS_IN.split(',').map((p, i) => {
          return (
            <input
              key={i}
              name={p}
              type="hidden"
              value={formData.params[p]}
            />
          );
        })}
        <input
          name="AUTHCODE"
          type="hidden"
          value={formData.params.AUTHCODE}
        />
      </form>
    ) : (
      this.state.error && (
        <>
          <main className={classes.Content}>
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

PaymentRedirect.propTypes = {
  formData: PropTypes.object.isRequired,
};

export default withTranslation()(PaymentRedirect);
