import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';

import classes from './RegistryItem.module.css';
import Collapsible from '../../../components/UI/Collapsible/Collapsible';
import RegistryItemDetails from '../../../components/RegistryItemDetails/RegistryItemDetails';
import {
  isAgreementActive,
  languagesToString,
} from '../../../util/registryUtil';

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
    const languages = languagesToString(this.props.item.languages);
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
                {this.props.t('registryItem.agreementExpired')}
              </div>
            )}
            <div className={classes.HeaderCity}>
              {this.props.item.address.city}
            </div>
          </div>
          <RegistryItemDetails
            item={this.props.item}
            clicked={this.props.update}
            agreementActive={agreementActive}
          />
        </Collapsible>
      </div>
    );
  }
}

RegistryItem.propTypes = {
  item: PropTypes.object.isRequired,
  update: PropTypes.func,
};

export default withNamespaces()(RegistryItem);
