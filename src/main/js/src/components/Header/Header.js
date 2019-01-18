import React from 'react';
import PropTypes from 'prop-types';

import classes from './Header.module.css';
import NavigationItems from './NavigationItems/NavigationItems';

const header = props => (
  <header className={classes.Header}>
    <nav className={classes.DesktopOnly}>
      {!props.withoutNavigation && <NavigationItems />}
    </nav>
  </header>
);

header.propTypes = {
  withoutNavigation: PropTypes.bool,
};

export default header;
