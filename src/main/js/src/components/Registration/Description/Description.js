import React from 'react';
import { withNamespaces } from 'react-i18next';
import PropTypes from 'prop-types';

import classes from './Description.module.css';

const description = props => (
  <React.Fragment>
    <p className={classes.Title}>{props.t('registration.description.title')}</p>
    <div className={classes.Description}>
      <span className={classes.StartingText}>
        {props.t('registration.description.text1')}
      </span>
      {props.t('registration.description.text2')}
      <br />
      <br />
      {props.t('registration.description.text3')}
      <br />
      <br />
      {props.t('registration.description.text4')}
    </div>
    <button className={classes.ContinueButton} onClick={props.clicked}>
      {props.t('registration.description.continue')}
    </button>
  </React.Fragment>
);

description.propTypes = {
  clicked: PropTypes.func.isRequired,
};

export default withNamespaces()(description);
