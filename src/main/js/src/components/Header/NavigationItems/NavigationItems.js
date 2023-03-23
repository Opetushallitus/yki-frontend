import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import classes from './NavigationItems.module.css';
import NavigationItem from './NavigationItem/NavigationItem';

const items = props => {
  return props.user && props.user.isAdmin ? (
    <React.Fragment>
      <NavigationItem link="/jarjestajarekisteri">
        {props.t('common.registry')}
      </NavigationItem>
      <div className={classes.Separator} />
      <NavigationItem link="/tutkintopaivat">
        {props.t('common.examDates')}
      </NavigationItem>
      <div className={classes.Separator} />
      <NavigationItem link="/maksuraportit">
        {props.t('common.paymentsReports')}
      </NavigationItem>
      <div className={classes.Separator} />
      <NavigationItem link="/osallistumiskiellot/odottavat">
        {props.t('quarantine.quarantines')}
      </NavigationItem>
    </React.Fragment>
  ) : (
    <NavigationItem link="/tutkintotilaisuudet">
      {props.t('common.examSessions')}
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
