import React from 'react';
import PropTypes from 'prop-types';

import classes from './Toolbar.module.css';
import Logo from '../../Logo/Logo';
import DrawerToggle from '../SideDrawer/DrawerToggle/DrawerToggle';

const toolbar = props => (
  <header className={classes.Toolbar}>
    <DrawerToggle clicked={props.drawerToggleClicked} />
    <div className={classes.Logo}>
      <Logo />
    </div>
    <nav className={classes.DesktopOnly}>
      <ul>
        <li>
          <a href="/">Navigation links</a>
        </li>
      </ul>
    </nav>
  </header>
);

toolbar.propTypes = {
  drawerToggleClicked: PropTypes.func.isRequired,
};

export default toolbar;