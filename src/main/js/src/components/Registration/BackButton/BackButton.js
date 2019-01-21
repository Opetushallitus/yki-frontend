import React from 'react';
import { withNamespaces } from 'react-i18next';

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

export default withNamespaces()(backButton);
