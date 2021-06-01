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
  } = props;

  return (
    <div className={classes.Container}>
      <input
        id={checkboxId}
        name={name}
        type="checkbox"
        tabIndex={0}
        checked={checked}
        className={classes.CbInput}
        onChange={e => {
          onChange();
        }}
        defaultChecked={checked || false}
        aria-label={ariaLabel || null}
      />

      <label className={classes.CbLabel} for={checkboxId}>
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
  checkboxId: PropTypes.string.isRequired,
  label: PropTypes.string,
};

export default checkbox;
