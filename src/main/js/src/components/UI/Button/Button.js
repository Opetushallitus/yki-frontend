import PropTypes from 'prop-types';
import React from 'react';

import classes from './Button.module.css';

const button = props => (
  <button
    type={props.type}
    disabled={props.disabled}
    className={[
      props.isRegistration ? 'YkiButton' : classes.Button,
      classes[props.btnType],
    ].join(' ')}
    onClick={props.clicked}
    tabIndex={props.tabIndex}
    data-cy={props.datacy}
    role="button"
    aria-label={props.ariaLabel}
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
  isRegistration: PropTypes.bool,
  datacy: PropTypes.string,
};

export default button;
