import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import axios from '../../axios';
import Alert from '../../components/Alert/Alert';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './NewEvaluationPaymentRedirect.module.css';

export class NewEvaluationPaymentRedirect extends Component {
  paymentForm = React.createRef();

  state = {
    redirectUrl: null,
    error: false,
  };

  componentDidMount = () => {
    const {
      match: { params },
      signature
    } = this.props;
    axios
      .get(`/yki/api/evaluation-payment/v2/${params.evaluationOrderId}/redirect?signature=${signature}`)
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

const mapStateToProps = state => {
	return {
		signature: state.registration.signature
	};
};

export default connect(mapStateToProps)(withTranslation()(NewEvaluationPaymentRedirect));