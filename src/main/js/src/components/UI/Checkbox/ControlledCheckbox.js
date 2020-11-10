import React from 'react';
import PropTypes from 'prop-types';

import classes from './Checkbox.module.css';

const ControlledCheckbox = props => (
    <label className={classes.Container}>
      <input
          type="checkbox"
          onChange={props.onChange}
          checked={props.checked || false}
          name={props.name}
      />
      <span className={classes.Checkmark} />
    </label>
);

ControlledCheckbox.propTypes = {
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool,
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default ControlledCheckbox;
