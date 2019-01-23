import React from 'react';

import classes from './Header.module.css';
import NavigationItems from './NavigationItems/NavigationItems';

const header = () => (
  <header className={classes.Header}>
    <nav className={classes.DesktopOnly}>
      <NavigationItems />
    </nav>
  </header>
);

export default header;
