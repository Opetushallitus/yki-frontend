import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import classes from './NavigationItems.module.css';
import NavigationItem from './NavigationItem/NavigationItem';

const items = props => {
  const organizerRegistry = (
    <NavigationItem link="/jarjestajarekisteri">
      {props.t('common.registry')}
    </NavigationItem>
  );
  const examDates = (
    <NavigationItem link="/tutkintopaivat">
      {props.t('common.examDates')}
    </NavigationItem>
  );
  const paymentsReports = (
    <NavigationItem link="/maksuraportit">
      {props.t('common.paymentsReports')}
    </NavigationItem>
  );
  const quarantines = (
    <NavigationItem link="/osallistumiskiellot/odottavat">
      {props.t('participationBan.title')}
    </NavigationItem>
  );
  const examSessions = (
    <NavigationItem link="/tutkintotilaisuudet">
      {props.t('common.examSessions')}
    </NavigationItem>
  );

  const separator = <div className={classes.Separator} />;

  if (props.user) {
    const { isAdmin, isOrganizer, isExtensiveReadAccessUser } = props.user;
    if (isAdmin) {
      return (
        <React.Fragment
          children={[
            organizerRegistry,
            separator,
            examDates,
            separator,
            paymentsReports,
            separator,
            quarantines,
          ]}
        />
      );
    } else if (isOrganizer && isExtensiveReadAccessUser) {
      return (
        <React.Fragment
          children={[organizerRegistry, separator, examSessions]}
        />
      );
    } else if (isExtensiveReadAccessUser) {
      return organizerRegistry;
    } else if (isOrganizer) {
      return examSessions;
    }
  }
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
