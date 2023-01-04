import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import classes from './Quarantine.module.css';

const QuarantineNav = (props) => {
  const { t } = props;

  return (
    <>
      <NavLink
        exact
        to="/karenssi/mahdolliset"
        className={classes.MenuItem}
        activeClassName={classes.Active}
      >
        {t('quarantine.pendingQuarantines')}
      </NavLink>
      <NavLink
        exact
        to="/karenssi/historia"
        className={classes.MenuItem}
        activeClassName={classes.Active}
      >
        {t('quarantine.reviewedQuarantines')}
      </NavLink>
      <NavLink
        exact
        to="/karenssi"
        className={classes.MenuItem}
        activeClassName={classes.Active}
      >
        {t('quarantine.activeQuarantines')}
      </NavLink>
    </>
  );
};

QuarantineNav.propTypes = {
  t: PropTypes.func.isRequired,
};

export default QuarantineNav;
