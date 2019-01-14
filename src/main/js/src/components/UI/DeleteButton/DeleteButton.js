import React from 'react';
import PropTypes from 'prop-types';

import classes from './DeleteButton.module.css';

const deleteButton = props =>
  !props.deleting ? (
    <button
      type="button"
      onClick={props.toggleDeleting}
      className={classes.Delete}
    >
      {props.deleteText}
    </button>
  ) : (
    <React.Fragment>
      <button
        type="button"
        onClick={props.onClick}
        className={classes.DeleteConfirmation}
      >
        {props.deleteConfirmText}
      </button>
      <button
        type="button"
        onClick={props.toggleDeleting}
        className={classes.DeleteCancel}
        autoFocus
      >
        {props.deleteCancelText}
      </button>
    </React.Fragment>
  );

deleteButton.propTypes = {
  deleting: PropTypes.bool.isRequired,
  toggleDeleting: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  deleteText: PropTypes.string.isRequired,
  deleteConfirmText: PropTypes.string.isRequired,
  deleteCancelText: PropTypes.string.isRequired,
};

export default deleteButton;
