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

// Note: even though the file mentions examSession etc,
// the component is actually used to render payment statuses
// of both exam and evaluation registrations
export class PaymentStatus extends Component {
  state = {
    examSession: null,
    loading: true,
  };

  componentDidMount() {
    if (!this.props.fetchExamSession) {
      this.setState({ loading: false });
      return;
    }

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
      }
    }
  }

  render() {
    const { status } = queryString.parse(this.props.location.search);
    const success = this.state.loading ? (
      <Spinner />
    ) : (
      <>{this.props.successContent}</>
    );

    const cancel = (
      <p data-cy="payment-status-text">
        {this.props.t(this.props.cancelMessage)}
      </p>
    );

    const error = (
      <p data-cy="payment-status-text">
        {this.props.t(this.props.failMessage)}
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

    const examDetailsCard = (
      <ExamDetailsCard
        isFull={false}
        exam={this.state.examSession}
        successHeader={true}
      />
    );

    const headLine = () => {
      if (!this.state.loading) {
        switch (status) {
          case 'payment-success': {
            return this.props.renderSuccessHeadline(this.state.examSession);
          }
          case 'payment-cancel': {
            return (
              <HeadlineContainer
                headlineTitle={this.props.t('payment.status.cancel')}
                headlineContent={this.state.examSession ? examDetailsCard : null}
                headlineImage={YkiImage2}
                disableContent={true}
              />
            );
          }
          default: {
            return (
              <HeadlineContainer
                headlineTitle={this.props.t('payment.status.error')}
                headlineContent={this.state.examSession ? examDetailsCard : null}
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
  renderSuccessHeadline: PropTypes.func.isRequired,
  successContent: PropTypes.element.isRequired,
  cancelMessage: PropTypes.string.isRequired,
  failMessage: PropTypes.string.isRequired,
  returnUrl: PropTypes.string.isRequired,
  fetchExamSession: PropTypes.bool,
};

const mapStateToProps = state => {
  return {
    user: state.user.user,
  };
};

export default connect(mapStateToProps)(withTranslation()(PaymentStatus));
