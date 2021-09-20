import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import classes from './NavigationItems.module.css';
import NavigationItem from './NavigationItem/NavigationItem';
import * as i18nKeys from "../../../common/LocalizationKeys";

const items = props => {
  return props.user && props.user.isAdmin ? (
    <React.Fragment>
      <NavigationItem link="/jarjestajarekisteri">
        {props.t(i18nKeys.common_registry)}
      </NavigationItem>
      <div className={classes.Separator} />
      <NavigationItem link="/tutkintopaivat">
        {props.t(i18nKeys.common_examDates)}
      </NavigationItem>
    </React.Fragment>
  ) : (
    <NavigationItem link="/tutkintotilaisuudet">
      {props.t(i18nKeys.common_examSessions)}
    </NavigationItem>
  );
};

export const navigationItems = props => (
  <ul className={classes.NavigationItems}>{items(props)}</ul>
);

const mapStateToProps = state => {
  return {
    user: state.user.user,
  };
};

export default connect(mapStateToProps)(withTranslation()(navigationItems));
