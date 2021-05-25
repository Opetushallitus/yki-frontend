import PropTypes from 'prop-types';
import React from 'react';

import classes from './Collapsible.module.css';

const collapsible = props => (
  <React.Fragment>
    {/* Button Element */}
    <div
      tabIndex={0}
      role="button"
      className={[classes.Header, props.className].join(' ')}
      onClick={props.clicked}
      onKeyPress={props.clicked}
    >
      {props.children[0]}
    </div>
    {/* Content */}
    <div
      className={`${props.extendedClassName} ${
        !props.show ? classes.HiddenContent : ''
      }`}
      aria-expanded={props.show}
    >
      {props.children[1]}
    </div>
  </React.Fragment>
);

collapsible.propTypes = {
  className: PropTypes.string,
  clicked: PropTypes.func.isRequired,
  children: PropTypes.any,
  extendedClassName: PropTypes.string,
};

export default collapsible;
