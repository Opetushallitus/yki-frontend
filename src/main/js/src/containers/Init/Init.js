import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as actions from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';

export class Init extends Component {
  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('lang')) {
      this.props.setLang(urlParams.get('lang'));
    }
    this.props.onFetchTranslations();
  }

  render() {
    return this.props.loading ? <Spinner /> : this.props.children;
  }
}

const mapStateToProps = state => {
  return {
    loading: state.localisation.loading,
    error: state.localisation.error,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchTranslations: () => dispatch(actions.fetchTranslations()),
    setLang: lang => dispatch(actions.setLang(lang)),
  };
};

Init.propTypes = {
  onFetchTranslations: PropTypes.func.isRequired,
  setLang: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Init);
