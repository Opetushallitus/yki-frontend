import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from '../../axios';
import { withNamespaces } from 'react-i18next';

import Alert from '../../components/Alert/Alert';
import Page from '../../hoc/Page/Page';

export class PaymentRedirect extends Component {
  paymentForm = React.createRef();

  state = {
    formData: {},
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
    if (this.state.formData.params) {
      this.paymentForm.current.submit();
    }
  };

  render() {
    return this.state.formData.params && !this.state.error ? (
      <form
        ref={this.paymentForm}
        action={this.state.formData.uri}
        method="POST"
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
      <Page withoutNavigation={true}>
        <Alert
          title={this.props.t('payment.redirect.error')}
          optionalText={this.props.t('payment.redirect.error.info')}
        />
      </Page>
    );
  }
}

PaymentRedirect.propTypes = {
  match: PropTypes.object.isRequired,
};

export default withNamespaces()(PaymentRedirect);
