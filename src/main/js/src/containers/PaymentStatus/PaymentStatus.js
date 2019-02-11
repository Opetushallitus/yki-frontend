import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import queryString from 'query-string';

import Header from '../../components/Header/Header';
import Hyperlink from '../../components/UI/Hyperlink/Hyperlink';
import classes from './PaymentStatus.module.css';
import axios from '../../axios';

export class PaymentStatus extends Component {
  state = {
    examSession: null,
  };

  componentDidMount() {
    if (!this.state.examSession) {
      const queryParams = queryString.parse(this.props.location.search);
      axios.get(`/yki/api/exam-session/${queryParams.id}`).then(({ data }) => {
        this.setState({ examSession: data });
      });
    }
  }

  render() {
    const success = (
      <React.Fragment>
        <div>
          <h1 data-cy="payment-status-header">
            {this.props.t('payment.status.success')}
          </h1>
          <p>{this.props.t('payment.status.success.info1')}:</p>
        </div>
        <div>
          <p>
            {this.props.t('payment.status.success.info2')}{' '}
            {this.props.user ? this.props.user.email : ''}
          </p>
        </div>
      </React.Fragment>
    );

    const cancel = (
      <div>
        <h1 data-cy="payment-status-header">
          {this.props.t('payment.status.cancel')}
        </h1>
        <p>{this.props.t('payment.status.cancel.info1')}</p>
      </div>
    );

    const error = (
      <div>
        <h1 data-cy="payment-status-header">
          {this.props.t('payment.status.error')}
        </h1>
        <p>{this.props.t('payment.status.error.info1')}</p>
      </div>
    );

    const content = () => {
      const queryParams = queryString.parse(this.props.location.search);

      switch (queryParams.status) {
        case 'payment-success': {
          return success;
        }
        case 'payment-cancel': {
          return cancel;
        }
        default: {
          return error;
        }
      }
    };

    return (
      <React.Fragment>
        <Header />
        <main className={classes.Content}>
          <div>{content()}</div>
          <div className={classes.BackButton}>
            <Hyperlink
              to={'/yki'}
              text={this.props.t('errorBoundary.return')}
            />
          </div>
        </main>
      </React.Fragment>
    );
  }
}

PaymentStatus.propTypes = {
  location: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    user: state.user.user,
  };
};

export default connect(mapStateToProps)(withNamespaces()(PaymentStatus));
