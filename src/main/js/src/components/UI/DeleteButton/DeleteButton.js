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
    const confirmButton = styles => (
      <button
        type="button"
        onClick={this.toggleDeleting}
        className={styles}
        autoFocus
      >
        {this.props.cancelText}
      </button>
    );
    const cancelButton = styles => (
      <button
        type="button"
        onClick={this.props.onClick}
        data-cy="button-confirm-delete"
        className={styles}
      >
        {this.props.confirmText}
      </button>
    );
    return !this.state.deleting ? (
      <button
        type="button"
        onClick={this.toggleDeleting}
        className={classes.Delete}
      >
        {this.props.children}
      </button>
    ) : this.props.confirmOnRight ? (
      <React.Fragment>
        {confirmButton(classes.DeleteLeft)}
        {cancelButton(classes.DeleteRight)}
      </React.Fragment>
    ) : (
      <React.Fragment>
        {cancelButton(classes.DeleteLeft)}
        {confirmButton(classes.DeleteRight)}
      </React.Fragment>
    );
  }
}

DeleteButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.any,
  confirmOnRight: PropTypes.bool,
  confirmText: PropTypes.string.isRequired,
  cancelText: PropTypes.string.isRequired,
};

export default DeleteButton;
