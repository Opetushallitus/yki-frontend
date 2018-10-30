import React from 'react';
import PropTypes from 'prop-types';

import OPHLogo from '../../assets/svg/oph-logo-vaaka.svg';
import classes from './Logo.module.css';

const logo = props => (
  <div className={classes.Logo} style={{ height: props.height }}>
    <img src={OPHLogo} alt="Opetushallitus" />
  </div>
);

logo.propTypes = {
  height: PropTypes.number,
};

export default logo;
