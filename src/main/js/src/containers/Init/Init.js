import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions/index';
import Alert from '../../components/Alert/Alert';

class Init extends Component {
  componentDidMount() {
    this.props.onFetchUser();
    this.props.onInitYkiLanguage();
  }

  render() {
    return !this.props.error && this.props.loading ? (
      <Spinner />
    ) : this.props.error ? (
      <Alert
        title={this.props.t('error.common')}
        returnLinkTo={window.location.href}
        returnLinkText={this.props.t('error.tryAgain')}
      />
    ) : (
      this.props.children
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user.user,
    loading: state.user.loading,
    error: state.user.error,
    yki: state.yki.ykiLanguage
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchUser: () => dispatch(actions.fetchUser()),
    onInitYkiLanguage: () => dispatch(actions.initYKILanguage())
  };
};

Init.propTypes = {
  children: PropTypes.any.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(Init));
