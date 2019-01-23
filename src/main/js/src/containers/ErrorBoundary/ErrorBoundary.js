import React, { Component } from 'react';
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
          title={this.props.t('errorBoundary.title')}
          returnLinkTo={window.location.href}
          returnLinkText={this.props.t('errorBoundary.return')}
        />
      );
    } else {
      return this.props.children;
    }
  }
}

export default withNamespaces()(ErrorBoundary);
