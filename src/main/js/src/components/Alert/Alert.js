import PropTypes from 'prop-types';
import React from 'react';

import Hyperlink from '../UI/Hyperlink/Hyperlink';
import classes from './Alert.module.css';

const alertClass = props => {
  return props.success ? classes.AlertSuccess : classes.AlertError;
};

const alert = props => (
  <div className={classes.Alert} aria-live="assertive">
    <div className={[classes.AlertContainer, alertClass(props)].join(' ')}>
      <div data-cy="alert-title" className={classes.AlertTitle}>
        {props.title}
      </div>
      {props.optionalText && (
        <div className={classes.AlertText}>{props.optionalText}</div>
      )}
      {props.returnLinkTo && (
        <div className={classes.AlertText}>
          <Hyperlink to={props.returnLinkTo} text={props.returnLinkText} />
        </div>
      )}
      {props.onClose && (
        <button
          type="button"
          title="Close"
          aria-label="Close"
          onClick={props.onClose}
        >
          <span aria-hidden="true">×</span>
        </button>
      )}
    </div>
  </div>
);

alert.propTypes = {
  title: PropTypes.string.isRequired,
  optionalText: PropTypes.string,
  onClose: PropTypes.func,
  returnLinkTo: PropTypes.string,
  returnLinkText: PropTypes.string,
  success: PropTypes.bool,
};

export default alert;
