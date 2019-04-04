import React from 'react';
import PropTypes from 'prop-types';

import OPHLogo from '../../../assets/svg/oph-logo.svg';
import classes from './Logo.module.css';

const logo = props => (
  <div className={classes.Logo}>
    <img src={OPHLogo} alt="Opetushallitus logo" />
  </div>
);

logo.propTypes = {
  size: PropTypes.number,
};

export default logo;
