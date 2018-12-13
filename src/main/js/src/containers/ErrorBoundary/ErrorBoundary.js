import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Alert from '../../components/Alert/Alert';
import axios from '../../axios';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

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
          title={this.props.title}
          returnLinkTo={this.props.returnLinkTo}
          returnLinkText={this.props.returnLinkText}
        />
      );
    } else {
      return this.props.children;
    }
  }
}

ErrorBoundary.propTypes = {
  title: PropTypes.string.isRequired,
  returnLinkTo: PropTypes.string.isRequired,
  returnLinkText: PropTypes.string,
};

export default ErrorBoundary;
