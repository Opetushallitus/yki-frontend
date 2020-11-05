import React from 'react';
import PropTypes from 'prop-types';

import classes from './Checkbox.module.css';

const checkbox = props => (
  <label className={classes.Container}>
    <input
      name={props.name}
      type="checkbox"
      onChange={props.onChange}
      defaultChecked={props.checked || false}
      aria-label={props.ariaLabel || null}
    />
    <span className={classes.Checkmark} data-cy={props.datacy} />
  </label>
);

checkbox.propTypes = {
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool,
  ariaLabel: PropTypes.string,
  datacy: PropTypes.string,
  name: PropTypes.string
};

export default checkbox;
