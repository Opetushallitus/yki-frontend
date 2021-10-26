import { ErrorMessage, Field } from 'formik';
import React from 'react';

import classes from './FormikInputField.module.css';

const FormikInputField = ({
  name,
  placeholder = '',
  extra,
  type = 'text',
  onFocus,
  required,
  label,
  customStyle,
  autoComplete,
  onContextMenu,
  onCopy,
  onPaste,
  onCut
}) => (
  <div className={classes.InputFieldWrapper}>
    <label id={`${name}-label`} htmlFor={name}>
      {label} {required && '*'}
    </label>
    <Field
      id={name}
      name={name}
      onFocus={onFocus}
      aria-required={required}
      aria-labelledby={`${name}-label`}
      data-cy={`input-${name}`}
      placeholder={placeholder}
      className={customStyle}
      type={type}
      aria-label={label}
      autoComplete={autoComplete}
      onContextMenu={onContextMenu}
      onPaste={onPaste}
      onCopy={onCopy}
      onCut={onCut}
    />
    {extra && <span>{extra}</span>}
    <ErrorMessage
      name={name}
      data-cy={`input-error-${name}`}
      component="span"
      className={classes.ErrorMessage}
    />
  </div>
);

export default FormikInputField;
