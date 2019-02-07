import React from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import classes from './BackButton.module.css';

const backButton = props => {
  return (
    <button
      className={classes.Return}
      onClick={props.clicked}
      aria-label="Return"
    >
      &lsaquo; {props.t('registration.return')}
    </button>
  );
};

backButton.propTypes = {
  clicked: PropTypes.func.isRequired,
};

export default withTranslation()(backButton);
