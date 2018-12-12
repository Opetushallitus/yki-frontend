import React, { Component } from 'react';
import { connect } from 'react-redux';

import classes from './UpdateRegistryItem.module.css';
import RegistryItemForm from '../../../../components/RegistryItemForm/RegistryItemForm';
import { firstCharToUpper } from '../../../../util/util';
import * as actions from '../../../../store/actions/index';

class UpdateRegistryItem extends Component {
  updateRegistryItemHandler = values => {
    this.props.onUpdateRegistryItem(values);
    this.props.onClose();
  };

  render() {
    return (
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
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onUpdateRegistryItem: values =>
      dispatch(actions.updateRegistryItem(values)),
  };
};

export default connect(
  null,
  mapDispatchToProps,
)(UpdateRegistryItem);
