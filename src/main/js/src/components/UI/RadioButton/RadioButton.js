import React from 'react';
import PropTypes from 'prop-types';

import classes from './RadioButton.module.css';

const radioButton = props => (
  <div
    className={
      props.disabled ? classes.RadioButtonDisabled : classes.RadioButton
    }
  >
    <input
      name={props.name}
      id={props.id}
      type="radio"
      data-cy={`radio-${props.id}`}
      value={props.id}
      checked={props.id === props.value}
      onChange={props.onChange}
      disabled={props.disabled || false}
    />
    <label htmlFor={props.id}>{props.label}</label>
  </div>
);

radioButton.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  value: PropTypes.string,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default radioButton;
