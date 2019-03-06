import React, { Component } from 'react';
import Flatpickr from 'flatpickr';
import { Finnish } from 'flatpickr/dist/l10n/fi.js';
import { Swedish } from 'flatpickr/dist/l10n/sv.js';
import 'flatpickr/dist/themes/airbnb.css';
import moment from 'moment';
import { DATE_FORMAT } from '../../../common/Constants';
import PropTypes from 'prop-types';

import classes from './DatePicker.module.css';

class DatePicker extends Component {
  componentDidMount() {
    const options = {
      ...this.props.options,
      locale: this.props.locale === 'sv' ? Swedish : Finnish,
      formatDate: d => moment(d).format(DATE_FORMAT),
      onClose: () => this.node.blur && this.node.blur(),
    };

    this.flatpickr = new Flatpickr(this.node, options);
    this.flatpickr.set('onChange', this.props.onChange);
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

DatePicker.propTypes = {
  id: PropTypes.string,
  options: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  tabIndex: PropTypes.string,
};

export default DatePicker;
