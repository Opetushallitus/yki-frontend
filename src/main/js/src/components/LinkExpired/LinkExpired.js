import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';

import YkiImage2 from '../../assets/images/ophYki_image2.png';
import HeadlineContainer from '../HeadlineContainer/HeadlineContainer';
import BackButton from '../Registration/BackButton/BackButton';
import classes from './LinkExpired.module.css';

export const linkExpired = props => {
  const { history, match } = props;

  const key = () => {
    switch (match.path) {
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
    <>
      <main id="main">
        <HeadlineContainer
          headlineTitle={props.t(key())}
          headlineContent={null}
          headlineImage={YkiImage2}
          disableContent={true}
        />
        <div className={classes.Content}>
          <BackButton clicked={() => history && history.push('/')} />
          <p>{props.t(`${key()}.info`)}</p>
        </div>
      </main>
    </>
  );
};

linkExpired.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withTranslation()(linkExpired);
