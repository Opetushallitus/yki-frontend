import React from 'react';
import PropTypes from 'prop-types';

import classes from './Button.css';
import ophStyles from '../../../assets/css/oph-styles.css';

const button = props => (
  <button
    type={props.type}
    disabled={props.disabled}
    className={[
      ophStyles['oph-button'],
      ophStyles['oph-button-primary'],
      classes.Button,
      classes[props.btnType],
    ].join(' ')}
    onClick={props.clicked}
  >
    {props.children}
  </button>
);

button.propTypes = {
  type: PropTypes.string,
  disabled: PropTypes.bool,
  btnType: PropTypes.string,
  clicked: PropTypes.func,
  children: PropTypes.any,
};

export default button;
