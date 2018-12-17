import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';

import classes from './UpdateRegistryItem.module.css';
import RegistryItemForm from '../../../../components/RegistryItemForm/RegistryItemForm';
import { firstCharToUpper } from '../../../../util/util';
import * as actions from '../../../../store/actions/index';

class UpdateRegistryItem extends Component {
  state = {
    deleting: false,
  };

  toggleDeleting = () => {
    this.setState(prevState => ({
      deleting: !prevState.deleting,
    }));
  };

  deleteRegistryItemHandler = oid => {
    this.props.onDeleteRegistryItem(oid);
    this.props.onClose();
  };

  updateRegistryItemHandler = values => {
    this.props.onUpdateRegistryItem(values);
    this.props.onClose();
  };

  render() {
    const remove = !this.state.deleting ? (
      <button onClick={this.toggleDeleting} className={classes.Delete}>
        {this.props.t('registryItem.delete')}
      </button>
    ) : (
      <React.Fragment>
        <button
          onClick={() => this.deleteRegistryItemHandler(this.props.item.oid)}
          className={classes.DeleteConfirmation}
        >
          {this.props.t('registryItem.deleteConfirm')}
        </button>
        <button
          onClick={this.toggleDeleting}
          className={classes.DeleteCancel}
          autoFocus
        >
          {this.props.t('registryItem.deleteCancel')}
        </button>
      </React.Fragment>
    );

    return (
      <React.Fragment>
        <div className={classes.Content}>
          <RegistryItemForm
            oid={this.props.item.oid}
            agreementStart={this.props.item.agreement.start}
            agreementEnd={this.props.item.agreement.end}
            contactName={this.props.item.contact.name}
            contactPhone={this.props.item.contact.phone}
            contactEmail={this.props.item.contact.email}
            languages={this.props.item.languages}
            extra={this.props.item.extra}
            name={this.props.item.name}
            address={`${this.props.item.address.street}, ${
              this.props.item.address.zipCode
            } ${firstCharToUpper(this.props.item.address.city)}`}
            updating
            onSubmit={this.updateRegistryItemHandler}
          />
        </div>
        <div className={classes.DeleteButtons}>{remove}</div>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onUpdateRegistryItem: values =>
      dispatch(actions.updateRegistryItem(values)),
    onDeleteRegistryItem: oid => dispatch(actions.deleteRegistryItem(oid)),
  };
};

UpdateRegistryItem.propTypes = {
  onUpdateRegistryItem: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default connect(
  null,
  mapDispatchToProps,
)(withNamespaces()(UpdateRegistryItem));
