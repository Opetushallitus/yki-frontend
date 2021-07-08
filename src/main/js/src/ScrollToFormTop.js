import React from 'react';

export default class ScrollToError extends React.Component {
  componentDidUpdate(prevProps) {
    if (
      prevProps.isSubmitting &&
      !this.props.isSubmitting &&
      !this.props.isValid
    ) {
      const scrollTo = document.getElementById('form');
      scrollTo.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }

  render() {
    return null;
  }
}
