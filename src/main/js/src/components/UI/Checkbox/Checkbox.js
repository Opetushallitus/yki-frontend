import PropTypes from 'prop-types';
import React from 'react';

import classes from './Checkbox.module.css';

const checkbox = props => {
  const {
    name,
    onChange,
    checked,
    ariaLabel,
    datacy,
    checkboxId,
    label,
    checkBoxClass,
  } = props;

  return (
    <div className={`${classes.Container} ${checkBoxClass}`}>
      <input
        id={checkboxId}
        name={name}
        type="checkbox"
        tabIndex={0}
        className={classes.CbInput}
        onChange={onChange}
        defaultChecked={checked || false}
        aria-label={ariaLabel || null}
      />

      <label data-cy={datacy} className={classes.CbLabel} htmlFor={checkboxId}>
        {label}
      </label>
    </div>
  );
};

checkbox.propTypes = {
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool,
  ariaLabel: PropTypes.string,
  datacy: PropTypes.string,
  name: PropTypes.string,
  checkboxId: PropTypes.string,
  label: PropTypes.string,
};

export default checkbox;
