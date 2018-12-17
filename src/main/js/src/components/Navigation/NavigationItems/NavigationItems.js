import React from 'react';
import { withNamespaces } from 'react-i18next';

import classes from './NavigationItems.module.css';
import NavigationItem from './NavigationItem/NavigationItem';

export const navigationItems = props => (
  <ul className={classes.NavigationItems}>
    <NavigationItem link="/jarjestajarekisteri">
      {props.t('common.registry')}
    </NavigationItem>
    <div className={classes.Separator} />
    <NavigationItem link="/tutkintotilaisuudet">
      {props.t('common.examSessions')}
    </NavigationItem>
    <div className={classes.Separator} />
    <NavigationItem link="/">{props.t('common.registration')}</NavigationItem>
  </ul>
);

export default withNamespaces()(navigationItems);
