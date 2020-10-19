import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import classes from './NavigationItem.module.css';

const navigationItem = props => (
  <li className={classes.NavigationItem}>
    <NavLink exact to={props.link} activeClassName={classes.ActiveTab}>
      {props.children}
    </NavLink>
  </li>
);

navigationItem.propTypes = {
  link: PropTypes.string.isRequired,
};

export default navigationItem;
