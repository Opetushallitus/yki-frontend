import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import RegistryItemForm from '../../../../components/RegistryItemForm/RegistryItemForm';
import ActionButton from '../../../../components/UI/ActionButton/ActionButton';
import * as actions from '../../../../store/actions/index';
import { capitalize } from '../../../../util/util';
import classes from './UpdateRegistryItem.module.css';

class UpdateRegistryItem extends Component {
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
            } ${capitalize(this.props.item.address.city)}`}
            updating
            onSubmit={this.updateRegistryItemHandler}
          />
        </div>
        <div className={classes.DeleteButtons}>
          <ActionButton
            onClick={() => this.deleteRegistryItemHandler(this.props.item.oid)}
            children={this.props.t('registryItem.delete')}
            confirmText={this.props.t('registryItem.deleteConfirm')}
            cancelText={this.props.t('registryItem.deleteCancel')}
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
)(withTranslation()(UpdateRegistryItem));
