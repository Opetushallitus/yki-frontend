import React from 'react';
import PropTypes from 'prop-types';

import classes from './Button.module.css';

const button = props => (
  <button
    type={props.type}
    disabled={props.disabled}
    className={[classes.Button, classes[props.btnType]].join(' ')}
    onClick={props.clicked}
    tabIndex={props.tabIndex}
  >
    {props.children}
  </button>
);

button.propTypes = {
  type: PropTypes.string,
  disabled: PropTypes.bool,
  btnType: PropTypes.string,
  clicked: PropTypes.func,
  tabIndex: PropTypes.string,
  children: PropTypes.any,
};

export default button;
