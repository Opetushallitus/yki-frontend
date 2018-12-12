import React from 'react';
import PropTypes from 'prop-types';

import classes from './Checkbox.module.css';

const checkbox = props => (
  <label className={classes.Container}>
    <input
      type="checkbox"
      onChange={() => props.onChange(props.languageCode, props.languageLevel)}
      defaultChecked={props.checked || false}
    />
    <span className={classes.Checkmark} />
  </label>
);

checkbox.propTypes = {
  onChange: PropTypes.func.isRequired,
  languageCode: PropTypes.string.isRequired,
  languageLevel: PropTypes.string.isRequired,
  checked: PropTypes.bool,
};

export default checkbox;
