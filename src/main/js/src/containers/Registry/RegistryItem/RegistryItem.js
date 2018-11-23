import React, { PureComponent } from 'react';

import classes from './RegistryItem.module.css';
import Collapsible from '../../../components/UI/Collapsible/Collapsible';
import RegistryItemDetails from '../../../components/RegistryItemDetails/RegistryItemDetails';
import { isAgreementActive } from '../../../util/registryUtil';

class RegistryItem extends PureComponent {
  state = {
    show: false,
  };

  toggleHandler = () => {
    this.setState(prevState => ({
      show: !prevState.show,
    }));
  };

  render() {
    const languages = this.props.item.languages
      .map(lang => {
        return lang.split(' ')[0].toLowerCase();
      })
      .join(', ');

    const agreementActive = isAgreementActive(
      this.props.item.agreement.start,
      this.props.item.agreement.end,
    );
    return (
      <div
        className={
          this.state.show
            ? classes.RegistryItemWithDetails
            : classes.RegistryItem
        }
      >
        <Collapsible
          show={this.state.show}
          clicked={this.toggleHandler}
          className={classes.Collapsible}
        >
          <div className={classes.HeaderText}>
            <div>
              <strong>{this.props.item.name}</strong>
            </div>
            {agreementActive ? (
              <div className={classes.HeaderLanguages}>{languages}</div>
            ) : (
              <div className={classes.AgreementExpired}>
                Sopimus vanhentunut
              </div>
            )}
            <div className={classes.HeaderCity}>
              {this.props.item.address.city}
            </div>
          </div>
          <RegistryItemDetails
            item={this.props.item}
            clicked={this.props.modify}
            agreementActive={agreementActive}
          />
        </Collapsible>
      </div>
    );
  }
}

export default RegistryItem;
