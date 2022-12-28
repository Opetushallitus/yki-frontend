import React from 'react';
import Spinner from '../Spinner/Spinner';

import classes from './SpinnerOverlay.module.css';

const SpinnerOverlay = () => (
  <div className={classes.SpinnerOverlay} aria-label="Loading">
    <Spinner />
  </div>
);

export default SpinnerOverlay;
