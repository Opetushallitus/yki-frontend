import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import classes from './LinkExpired.module.css';
import Hyperlink from '../UI/Hyperlink/Hyperlink';
import Header from '../Header/Header';

export const linkExpired = props => {
  const key = () => {
    switch (props.match.path) {
      case '/ilmoittautuminen/vanhentunut': {
        return 'registration.expired.loginlink';
      }
      case '/maksu/vanhentunut': {
        return 'registration.expired.paymentlink';
      }
      default: {
        return 'registration.expired.link';
      }
    }
  };

  return (
    <React.Fragment>
      <Header />
      <main className={classes.Content}>
        <h1 data-cy="link-expired-header">{props.t(key())}</h1>
        <p>{props.t(`${key()}.info`)}</p>
        <div className={classes.BackButton}>
          <Hyperlink to={'/yki/'} text={props.t('errorBoundary.return')} />
        </div>
      </main>
    </React.Fragment>
  );
};

linkExpired.propTypes = {
  match: PropTypes.object.isRequired,
};

export default withTranslation()(linkExpired);
