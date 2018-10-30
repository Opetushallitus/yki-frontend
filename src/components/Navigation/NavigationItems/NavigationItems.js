import React from 'react';

import classes from './NavigationItems.module.css';
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = () => (
  <ul className={classes.NavigationItems}>
    <NavigationItem link="/jarjestajarekisteri">
      Järjestäjärekisteri
    </NavigationItem>
    <div className={classes.Separator} />
    <NavigationItem link="/tutkintotilaisuudet">
      Tutkintotilaisuudet
    </NavigationItem>
  </ul>
);

export default navigationItems;
