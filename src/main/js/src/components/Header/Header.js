import React from 'react';

import classes from './Header.module.css';
import Logo from '../UI/Logo/Logo';
import NavigationItems from './NavigationItems/NavigationItems';

const header = ({ nav }) =>
  nav ? (
    <header className={classes.Header}>
      <nav className={classes.DesktopOnly}>
        <NavigationItems />
      </nav>
    </header>
  ) : (
    <header className={classes.RegistrationHeader}>
      <Logo />
      Opetushallitus
    </header>
  );

export default header;
