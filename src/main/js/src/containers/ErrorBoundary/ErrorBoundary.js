import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from '../../axios';
import { withNamespaces } from 'react-i18next';

import Alert from '../../components/Alert/Alert';

export class ErrorBoundary extends Component {
  state = {
    error: null,
  };

  componentDidCatch(error) {
    this.setState({ error });
    axios.post('/yki/log', {
      message: error.message,
      stack: error.stack,
      pathname: this.props.location ? this.props.location.pathname : '',
    });
  }

  render() {
    if (this.state.error) {
      return (
        <Alert
          title={this.props.t(this.props.titleKey)}
          returnLinkTo={this.props.returnLinkTo}
          returnLinkText={this.props.t(this.props.returnLinkTextKey)}
        />
      );
    } else {
      return this.props.children;
    }
  }
}

ErrorBoundary.propTypes = {
  titleKey: PropTypes.string.isRequired,
  returnLinkTo: PropTypes.string.isRequired,
  returnLinkTextKey: PropTypes.string,
};

export default withNamespaces()(ErrorBoundary);
