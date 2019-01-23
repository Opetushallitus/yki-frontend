import React from 'react';
import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';

import classes from './NavigationItems.module.css';
import NavigationItem from './NavigationItem/NavigationItem';

export const registryItem = props => {
  return props.user && props.user.isAdmin ? (
    <React.Fragment>
      <NavigationItem link="/jarjestajarekisteri">
        {props.t('common.registry')}
      </NavigationItem>
      <div className={classes.Separator} />
    </React.Fragment>
  ) : null;
};

export const navigationItems = props => (
  <ul className={classes.NavigationItems}>
    {registryItem(props)}
    <NavigationItem link="/tutkintotilaisuudet">
      {props.t('common.examSessions')}
    </NavigationItem>
  </ul>
);

const mapStateToProps = state => {
  return {
    user: state.user.user,
  };
};

export default connect(mapStateToProps)(withNamespaces()(navigationItems));
