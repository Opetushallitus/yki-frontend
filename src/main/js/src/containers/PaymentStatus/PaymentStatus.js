import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import queryString from 'query-string';

import Header from '../../components/Header/Header';
import Spinner from '../../components/UI/Spinner/Spinner';
import Hyperlink from '../../components/UI/Hyperlink/Hyperlink';
import classes from './PaymentStatus.module.css';
import axios from '../../axios';
import ExamDetailsCard from '../../components/Registration/ExamDetailsPage/ExamDetailsCard/ExamDetailsCard';

export class PaymentStatus extends Component {
  state = {
    examSession: null,
    loading: true,
  };

  componentDidMount() {
    if (!this.state.examSession) {
      const { id } = queryString.parse(this.props.location.search);
      // only get exam session if url contains id query parameter
      if (id) {
        axios
          .get(`/yki/api/exam-session/${id}`)
          .then(({ data }) => {
            this.setState({ examSession: data, loading: false });
          })
          .catch(() => this.setState({ loading: false }));
      } else {
        this.setState({ loading: false });
      }
    }
  }

  render() {
    const success = this.state.loading ? (
      <Spinner />
    ) : (
      <React.Fragment>
        <div>
          <h1 data-cy="payment-status-header">
            {this.props.t('payment.status.success')}
          </h1>
          {this.state.examSession && (
            <React.Fragment>
              <p>{this.props.t('payment.status.success.info1')}:</p>
              <ExamDetailsCard exam={this.state.examSession} isFull={false} />
            </React.Fragment>
          )}
        </div>
        <div>
          <p>{this.props.t('payment.status.success.info2')}</p>
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
      const { status } = queryString.parse(this.props.location.search);

      switch (status) {
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
              to={'/yki/'}
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

export default connect(mapStateToProps)(withTranslation()(PaymentStatus));
