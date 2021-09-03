import React from 'react';
import PropTypes from 'prop-types';

import classes from './RadioButton.module.css';

const radioButton = props => (
  <div
    className={[
      classes.RadioButton,
      !props.disabled ? classes.RadioButtonEnabled : classes.RadioButtonDisabled,
    ].join(' ')}
  >
    <input
      name={props.name}
      id={props.id}
      type="radio"
      data-cy={`radio-${props.id}`}
      value={props.checkedValue}
      checked={props.checkedValue === props.value}
      onChange={props.onChange}
      disabled={props.disabled || false}
    />
    <label className={classes.RadioButtonLabel} htmlFor={props.id}>{props.label}</label>
    {props.extraLabel ? (
      <label className={classes.RadioButtonExtraLabel} htmlFor={props.id}>{props.extraLabel}</label>
    ) : null}
  </div>
);

radioButton.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  value: PropTypes.string,
  checkedValue: PropTypes.any.isRequired,
  label: PropTypes.string.isRequired,
  extraLabel: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default radioButton;
