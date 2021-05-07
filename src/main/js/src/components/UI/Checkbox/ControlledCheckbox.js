import React from 'react';
import PropTypes from 'prop-types';

import classes from './Checkbox.module.css';

const ControlledCheckbox = props => (
  <label data-cy={props.dataCy} className={classes.Container}>
    <input
      type="checkbox"
      onChange={props.onChange}
      checked={props.checked || false}
      name={props.name}
      disabled={props.disabled}
    />
    {!props.hidden && <span className={classes.Checkmark} />}
  </label>
);

ControlledCheckbox.propTypes = {
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool,
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disabled: PropTypes.bool,
  hidden: PropTypes.bool,
  dataCy: PropTypes.string,
};

export default ControlledCheckbox;
