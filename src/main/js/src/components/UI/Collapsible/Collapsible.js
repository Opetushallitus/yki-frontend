import React from 'react';
import PropTypes from 'prop-types';

import classes from './Collapsible.module.css';

const collapsible = props => (
  <React.Fragment>
    <div
      className={[classes.Header, props.className].join(' ')}
      onClick={props.clicked}
    >
      {props.children[0]}
    </div>
    <div
      style={{
        display: props.show ? 'block' : 'none',
      }}
    >
      {props.children[1]}
    </div>
  </React.Fragment>
);

collapsible.propTypes = {
  className: PropTypes.string,
  clicked: PropTypes.func.isRequired,
};

export default collapsible;
