import React from 'react';

import classes from './NavigationItems.module.css';
import NavigationItem from './NavigationItem/NavigationItem';
import i18n from '../../../common/i18n';

const navigationItems = () => (
  <ul className={classes.NavigationItems}>
    <NavigationItem link="/jarjestajarekisteri">
      {i18n.t('common.registry')}
    </NavigationItem>
    <div className={classes.Separator} />
    <NavigationItem link="/tutkintotilaisuudet">
      {i18n.t('common.examSessions')}
    </NavigationItem>
    <div className={classes.Separator} />
    <NavigationItem link="/">{i18n.t('common.registration')}</NavigationItem>
  </ul>
);

export default navigationItems;
