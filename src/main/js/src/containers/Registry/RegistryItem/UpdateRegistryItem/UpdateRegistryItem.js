import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';

import classes from './UpdateRegistryItem.module.css';
import RegistryItemForm from '../../../../components/RegistryItemForm/RegistryItemForm';
import DeleteButton from '../../../../components/UI/DeleteButton/DeleteButton';
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
        <div className={classes.DeleteButtons}>
          <DeleteButton
            onClick={() => this.deleteRegistryItemHandler(this.props.item.oid)}
            deleting={this.state.deleting}
            toggleDeleting={this.toggleDeleting}
            deleteText={this.props.t('registryItem.delete')}
            deleteConfirmText={this.props.t('registryItem.deleteConfirm')}
            deleteCancelText={this.props.t('registryItem.deleteCancel')}
          />
        </div>
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
