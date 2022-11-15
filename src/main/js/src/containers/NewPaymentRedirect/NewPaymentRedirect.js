import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';

import axios from '../../axios';
import Alert from '../../components/Alert/Alert';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './NewPaymentRedirect.module.css';

export class NewPaymentRedirect extends Component {
  paymentForm = React.createRef();

  state = {
    error: false,
    redirectUrl: undefined
  };

  componentDidMount = () => {
    const {
      match: { params },
    } = this.props;
    axios
      .get(`/yki/api/payment/v2/${params.registrationId}/redirect`)
      .then(({ data }) => {
        this.setState({ redirectUrl: data.redirect })
      })
      .catch(err => {
        this.setState({ error: true });
      });
  };

  componentDidUpdate = () => {
    if (this.state.redirectUrl) {
      window.location.href = this.state.redirectUrl;
    }
  }

  render() {
    return !this.state.error ? (
      <main id="main" className={classes.Content}>
        <Spinner />
      </main>
    ) : (
      <>
        <main id="main" className={classes.Content}>
          <Alert
            title={this.props.t('payment.redirect.error')}
            optionalText={this.props.t('payment.redirect.error.info')}
          />
        </main>
      </>
    );
  }
}

NewPaymentRedirect.propTypes = {
  match: PropTypes.object.isRequired,
};

export default withTranslation()(NewPaymentRedirect);
