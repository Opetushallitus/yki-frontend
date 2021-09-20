import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';

import YkiImage2 from '../../assets/images/ophYki_image2.png';
import HeadlineContainer from '../HeadlineContainer/HeadlineContainer';
import BackButton from '../Registration/BackButton/BackButton';
import classes from './LinkExpired.module.css';
import * as i18nKeys from "../../common/LocalizationKeys";

export const linkExpired = props => {
  const { match } = props;

  const key = () => {
    switch (match.path) {
      case '/ilmoittautuminen/vanhentunut': {
        return i18nKeys.registration_expired_loginlink;
      }
      case '/maksu/vanhentunut': {
        return i18nKeys.registration_expired_paymentlink;
      }
      default: {
        return i18nKeys.registration_expired_link;
      }
    }
  };

  const keyInfo = () => {
    switch (match.path) {
      case '/ilmoittautuminen/vanhentunut': {
        return i18nKeys.registration_expired_loginlink_info;
      }
      case '/maksu/vanhentunut': {
        return i18nKeys.registration_expired_paymentlink_info;
      }
      default: {
        return i18nKeys.registration_expired_link_info;
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
          <BackButton href="/" />
          <p>{props.t(keyInfo())}</p>
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
