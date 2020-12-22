import React, { Component } from 'react';
import Flatpickr from 'flatpickr';
import { Finnish } from 'flatpickr/dist/l10n/fi.js';
import { Swedish } from 'flatpickr/dist/l10n/sv.js';
import { english } from 'flatpickr/dist/l10n/default';
import 'flatpickr/dist/themes/airbnb.css';
import moment from 'moment';
import { DATE_FORMAT } from '../../../common/Constants';
import PropTypes from 'prop-types';

import classes from './DatePicker.module.css';

class DatePicker extends Component {
  componentDidMount() {
    const options = {
      ...this.props.options,
      locale: selectLocale(this.props.locale),
      formatDate: d => moment(d).format(DATE_FORMAT),
      onClose: () => this.node.blur && this.node.blur(),
    };

    this.flatpickr = new Flatpickr(this.node, options);
    this.flatpickr.set('onChange', this.props.onChange);

    if (this.props.disabled === true) {
      this.flatpickr._input.setAttribute('disabled', 'disabled');
    } if (this.props.disabled === false) {
      this.flatpickr._input.removeAttribute('disabled');
    }

  }

  componentWillUnmount() {
    this.flatpickr.destroy();
  }

  render() {
    return (
      <input
        id={this.props.id}
        className={classes.DatePicker}
        {...this.props}
        ref={node => {
          this.node = node;
        }}
        tabIndex={this.props.tabIndex}
      />
    );
  }
}

const selectLocale = tag => {
  switch (tag) {
    case 'sv':
      return Swedish;
    case 'fi':
      return Finnish;
    default:
      return english;
  }
}

DatePicker.propTypes = {
  id: PropTypes.string,
  options: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  tabIndex: PropTypes.string,
  disabled: PropTypes.bool,
};

export default DatePicker;
