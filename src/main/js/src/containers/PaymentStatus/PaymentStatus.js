import PropTypes from 'prop-types';
import queryString from 'query-string';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import YkiImage2 from '../../assets/images/ophYki_image2.png';
import axios from '../../axios';
import HeadlineContainer from '../../components/HeadlineContainer/HeadlineContainer';
import BackButton from '../../components/Registration/BackButton/BackButton';
import ExamDetailsCard from '../../components/Registration/ExamDetailsPage/ExamDetailsCard/ExamDetailsCard';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './PaymentStatus.module.css';

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
          .get(`${this.props.infoUrl}${id}`)
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
    const { status } = queryString.parse(this.props.location.search);
    const success = this.state.loading ? (
      <Spinner />
    ) : (
      <>
        <p data-cy="payment-status-text">
          {this.props.t(
            this.props.successMessage || 'payment.status.success.info2',
          )}
        </p>
      </>
    );

    const cancel = (
      <p data-cy="payment-status-text">
        {this.props.t(
          this.props.cancelMessage || 'payment.status.cancel.info1',
        )}
      </p>
    );

    const error = (
      <p data-cy="payment-status-text">
        {this.props.t(this.props.failMessage || 'payment.status.error.info1')}
      </p>
    );

    const content = () => {
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

    const headlineContent = () => {
      if (!this.state.examSession) return null;
      return (
        <ExamDetailsCard
          isFull={false}
          exam={this.state.examSession}
          successHeader={true}
        />
      );
    };

    const headLine = () => {
      if (!this.state.loading) {
        switch (status) {
          case 'payment-success': {
            return (
              <HeadlineContainer
                headlineTitle={`${this.props.t(
                  'email.payment_success.subject',
                )}!`}
                headlineContent={headlineContent()}
                headlineImage={YkiImage2}
              />
            );
          }
          case 'payment-cancel': {
            return (
              <HeadlineContainer
                headlineTitle={this.props.t('payment.status.cancel')}
                headlineContent={headlineContent()}
                headlineImage={YkiImage2}
                disableContent={true}
              />
            );
          }
          default: {
            return (
              <HeadlineContainer
                headlineTitle={this.props.t('payment.status.error')}
                headlineContent={headlineContent()}
                headlineImage={YkiImage2}
                disableContent={true}
              />
            );
          }
        }
      }
    };

    return (
      <>
        <main id="main">
          <div>{headLine()}</div>
          <div className={classes.Content}>
            <BackButton href={this.props.returnUrl} />
            <div>{content()}</div>
          </div>
        </main>
      </>
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
