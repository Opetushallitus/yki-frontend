import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

import classes from './RadioButton.module.css';

const radioButton = props => {

  /**
   * Undo disabled radio button selections 
   * in case of change language and level changes
   */
  useEffect(() => {
    if (
      props.values &&
      props.setFieldValue &&
      props.name !== 'language' &&
      props.checkedValue === props.value &&
      props.disabled &&
      props.values[props.name] !== ''
    ) {
      props.setFieldValue(props.name, '');
    }
  });

  return (
    <div
      className={classes.RadioButton}
    >
      <input
        className={classes.RadioButtonInput}
        name={props.name}
        id={props.id}
        type="radio"
        data-cy={`radio-${props.id}`}
        value={props.checkedValue}
        checked={props.checkedValue === props.value}
        onChange={props.onChange}
        disabled={props.disabled || false}
      />
      <label
        className={classes.RadioButtonLabel}
        htmlFor={props.id}>
        {props.label}
      </label>
      {props.extraLabel ? (
        <label
          className={classes.RadioButtonExtraLabel}
          htmlFor={props.id}>
          {props.extraLabel}
        </label>
      ) : null}
    </div>
  )
};

radioButton.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  value: PropTypes.string,
  checkedValue: PropTypes.any.isRequired,
  label: PropTypes.string.isRequired,
  extraLabel: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  values: PropTypes.object,
  setFieldValue: PropTypes.func
};

export default radioButton;
