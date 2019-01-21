import React from 'react';
import { withNamespaces } from 'react-i18next';

import classes from './Description.module.css';
import Header from '../../../components/Header/Header';

const description = props => {
  document.title = 'YKI';
  return (
    <React.Fragment>
      <Header />
      <div className={classes.Content}>
        <p className={classes.Title}>
          {props.t('registration.description.title')}
        </p>
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
        <button
          className={classes.ContinueButton}
          onClick={() =>
            props.history.push(props.t('registration.path.select.language'))
          }
        >
          {props.t('registration.description.continue')}
        </button>
      </div>
    </React.Fragment>
  );
};

export default withNamespaces()(description);
