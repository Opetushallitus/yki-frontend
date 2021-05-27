import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import Alert from '../../components/Alert/Alert';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions/index';

class Init extends Component {
  componentDidMount() {
    this.props.onFetchUser();
    this.props.onInitYkiLanguage();
    this.props.onSetWindowWidth(window.innerWidth);
    window.addEventListener('resize', this.debouncedHandleResize);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.debouncedHandleResize);
  }

  debounce(fn, ms) {
    let timer;
    return _ => {
      clearTimeout(timer);
      timer = setTimeout(_ => {
        timer = null;
        fn.apply(this, arguments);
      }, ms);
    };
  }

  debouncedHandleResize = this.debounce(function handleResize() {
    this.props.onSetWindowWidth(window.innerWidth);
  }, 500);

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
    yki: state.yki.ykiLanguage,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchUser: () => dispatch(actions.fetchUser()),
    onInitYkiLanguage: () => dispatch(actions.initYKILanguage()),
    onSetWindowWidth: width => dispatch(actions.setWindowWidth(width)),
  };
};

Init.propTypes = {
  children: PropTypes.any.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(Init));
