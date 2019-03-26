import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions/index';
import Alert from '../../components/Alert/Alert';

class Init extends Component {
  componentDidMount() {
    if (!window.location.hostname.startsWith('yki')){
      this.props.onFetchUser();
    }
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
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchUser: () => dispatch(actions.fetchUser()),
  };
};

Init.propTypes = {
  children: PropTypes.any.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(Init));
