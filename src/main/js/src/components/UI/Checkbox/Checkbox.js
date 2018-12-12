import React from 'react';
import PropTypes from 'prop-types';

import classes from './Checkbox.module.css';

const checkbox = props => (
  <label className={classes.Container}>
    <input
      type="checkbox"
      onChange={props.onChange}
      defaultChecked={props.checked || false}
    />
    <span className={classes.Checkmark} />
  </label>
);

checkbox.propTypes = {
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool,
};

export default checkbox;
