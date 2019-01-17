import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classes from './DeleteButton.module.css';

export class DeleteButton extends Component {
  state = {
    deleting: false,
  };

  toggleDeleting = () => {
    this.setState(prevState => ({
      deleting: !prevState.deleting,
    }));
  };

  render() {
    return !this.state.deleting ? (
      <button
        type="button"
        onClick={this.toggleDeleting}
        className={classes.Delete}
      >
        {this.props.children}
      </button>
    ) : (
      <React.Fragment>
        <button
          type="button"
          onClick={this.props.onClick}
          data-cy="button-confirm-delete"
          className={classes.DeleteConfirmation}
        >
          {this.props.confirmText}
        </button>
        <button
          type="button"
          onClick={this.toggleDeleting}
          className={classes.DeleteCancel}
          autoFocus
        >
          {this.props.cancelText}
        </button>
      </React.Fragment>
    );
  }
}

DeleteButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.any,
  confirmText: PropTypes.string.isRequired,
  cancelText: PropTypes.string.isRequired,
};

export default DeleteButton;
