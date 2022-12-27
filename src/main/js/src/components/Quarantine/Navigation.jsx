import React from 'react';
import { NavLink } from 'react-router-dom';
import classes from './Quarantine.module.css';

const QuarantineNav = () => {
  return (
    <>
      <NavLink
        exact
        to="/karenssi/mahdolliset"
        className={classes.MenuItem}
        activeClassName={classes.Active}
      >
        Odottavat tarkistukset
      </NavLink>
      <NavLink
        exact
        to="/karenssi/historia"
        className={classes.MenuItem}
        activeClassName={classes.Active}
      >
        Aiemmat tarkistukset
      </NavLink>
      <NavLink
        exact
        to="/karenssi"
        className={classes.MenuItem}
        activeClassName={classes.Active}
      >
        Aktiiviset karenssit
      </NavLink>
    </>
  );
};

export default QuarantineNav;
