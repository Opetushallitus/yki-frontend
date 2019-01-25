import React from 'react';
import PropTypes from 'prop-types';

import classes from './Button.module.css';

const button = props => (
  <button
    type={props.type}
    disabled={props.disabled}
    className={[
      props.isParticipant ? classes.ParticipantButton : classes.Button,
      classes[props.btnType],
    ].join(' ')}
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
  isParticipant: PropTypes.bool,
};

export default button;
