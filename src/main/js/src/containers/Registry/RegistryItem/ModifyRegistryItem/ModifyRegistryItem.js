import React, { Component } from 'react';

import classes from './ModifyRegistryItem.module.css';
import RegistryItemForm from '../../../../components/RegistryItemForm/RegistryItemForm';
import { firstCharToUpper } from '../../../../util/util';

class ModifyRegistryItem extends Component {
  updateRegistryItemHandler = values => {
    console.log(values);
  };

  render() {
    console.log(
      `Agreement start: ${this.props.item.agreement.start}, agreementEnd: ${
        this.props.item.agreement.end
      }`,
    );
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
          modifying
          onSubmit={this.updateRegistryItemHandler}
        />
      </div>
    );
  }
}

export default ModifyRegistryItem;
