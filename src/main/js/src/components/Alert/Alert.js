import React from 'react';
import PropTypes from 'prop-types';

const alert = props => (
  <div className={}>
    <div
      className={}
    >
      <div className={}>
        <div className={}>{props.title}</div>
        {props.optionalText && (
          <div className={}>
            {props.optionalText}
          </div>
        )}
        <button
          className={}
          type="button"
          title="Close"
          aria-label="Close"
          onClick={props.onClose}
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
    </div>
  </div>
);

alert.PropTypes = {
  title: PropTypes.string,
  optionalText: PropTypes.string,
  onClose: PropTypes.func,
};

export default alert;
