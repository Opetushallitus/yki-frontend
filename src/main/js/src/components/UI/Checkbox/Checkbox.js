import React from 'react';

import classes from './Checkbox.module.css';

const checkbox = props => {
  return (
    <label className={classes.Container}>
      <input type="checkbox" onClick={props.clicked} />
      <span className={classes.Checkmark} />
    </label>
  );
};

export default checkbox;
