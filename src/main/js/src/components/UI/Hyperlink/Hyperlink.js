import React from 'react';
import PropTypes from 'prop-types';

import classes from './Hyperlink.module.css';

const hyperlink = props => {
  let prefix = '';

  switch (props.type) {
    case 'email':
      prefix = 'mailto:';
      break;
    case 'phone':
      prefix = 'tel:';
      break;
    default:
      prefix = '';
  }

  return (
    <p>
      <a href={prefix + props.to} className={classes.Hyperlink}>
        {props.to}
      </a>
    </p>
  );
};

hyperlink.propTypes = {
  type: PropTypes.string,
  to: PropTypes.string.isRequired,
};

export default hyperlink;
