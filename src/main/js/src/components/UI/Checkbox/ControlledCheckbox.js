import PropTypes from 'prop-types';
import React from 'react';

import classes from './Checkbox.module.css';

// TODO: unused, could be deleted
const ControlledCheckbox = props => (
  <label data-cy={props.dataCy} className={classes.Container}>
    {!props.hidden && (
      <input
        className={classes.ControlledCheckbox}
        type="checkbox"
        onChange={props.onChange}
        checked={props.checked || false}
        name={props.name}
        disabled={props.disabled}
      />
    )}
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
