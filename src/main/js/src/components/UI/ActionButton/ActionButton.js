import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classes from './ActionButton.module.css';

export class ActionButton extends Component {
  state = {
    confirming: false,
  };

  toggleConfirming = () => {
    this.setState(prevState => ({
      confirming: !prevState.confirming,
    }));
  };

  render() {
    const cancelButton = styles => (
      <button
        type="button"
        onClick={this.toggleConfirming}
        data-cy="button-cancel-action"
        className={styles}
        autoFocus
        disabled={this.props.buttonsDisabled}
      >
        {this.props.cancelText}
      </button>
    );
    const confirmButton = styles => (
      <button
        type="button"
        onClick={this.props.onClick}
        data-cy="button-confirm-action"
        className={styles}
        disabled={this.props.buttonsDisabled}
      >
        {this.props.confirmText}
      </button>
    );
    return !this.state.confirming ? (
      <button
        type="button"
        onClick={this.toggleConfirming}
        data-cy="button-action"
        className={classes.Action}
      >
        {this.props.children}
      </button>
    ) : this.props.confirmOnRight ? (
      <React.Fragment>
        {cancelButton(classes.ActionLeft)}
        {confirmButton(classes.ActionRight)}
      </React.Fragment>
    ) : (
      <React.Fragment>
        {confirmButton(classes.ActionLeft)}
        {cancelButton(classes.ActionRight)}
      </React.Fragment>
    );
  }
}

ActionButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.any,
  confirmOnRight: PropTypes.bool,
  confirmText: PropTypes.string.isRequired,
  cancelText: PropTypes.string.isRequired,
  buttonsDisabled: PropTypes.bool,
};

export default ActionButton;
