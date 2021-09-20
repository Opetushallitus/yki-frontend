import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import classes from './RegistryItem.module.css';
import Collapsible from '../../../components/UI/Collapsible/Collapsible';
import RegistryItemDetails from '../../../components/RegistryItemDetails/RegistryItemDetails';
import { languagesToString } from '../../../util/util';
import { nowBetweenDates } from '../../../util/util';
import * as i18nKeys from "../../../common/LocalizationKeys";

class RegistryItem extends PureComponent {
  state = {
    show: false,
    showModal: false,
    selectedOid: null,
  };

  toggleHandler = () => {
    this.setState(prevState => ({
      show: !prevState.show,
    }));
  };

  openModalHandler = orgId => this.setState({ showModal: true, selectedOid: orgId });

  closeModalHandler = () =>
    this.setState({ showModal: false, selectedOid: null });



  render() {

    const languages = languagesToString(this.props.item.languages);
    const agreementActive = nowBetweenDates(
      this.props.item.agreement.start,
      this.props.item.agreement.end,
    );
    const hasPaymentInfo =
      this.props.item.merchant &&
      this.props.item.merchant.merchant_id &&
      this.props.item.merchant.merchant_secret;
    return (
      <>
        {/*  {orgSessionsModal} */}
        <div
          className={
            this.state.show
              ? classes.RegistryItemWithDetails
              : classes.RegistryItem
          }
          data-cy="registry-item"
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
                hasPaymentInfo ? (
                  <div className={classes.HeaderLanguages}>{languages}</div>
                ) : (
                    <div className={classes.AgreementExpired}>
                      {this.props.t(i18nKeys.registryItem_paymentInfoMissing)}
                    </div>
                  )
              ) : (
                  <div className={classes.AgreementExpired}>
                    {this.props.t(i18nKeys.registryItem_agreementExpired)}
                  </div>
                )}
              <div className={classes.HeaderCity}>
                {this.props.item.address.city}
              </div>
            </div>
            <RegistryItemDetails
              item={this.props.item}
              modify={this.props.update}
              openSessions={this.openModalHandler}
              agreementActive={agreementActive}
            />
          </Collapsible>
        </div>
      </>
    );
  }
}

RegistryItem.propTypes = {
  item: PropTypes.object.isRequired,
  update: PropTypes.func,
};

export default withTranslation()(RegistryItem);
