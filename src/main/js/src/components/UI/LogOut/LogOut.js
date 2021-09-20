import React from 'react';
// import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import classes from './LogOut.module.css';

export const LogOut = ({ user }) => {
  // const { t } = useTranslation();

  return (
    user ? 
      <React.Fragment>
      <a id='logout-link' className={classes.LogOut} href={`/yki/auth/logout`}>
        {/* {t(i18nKeys.logout_text)} */}
        Kirjaudu ulos
      </a>
      </React.Fragment>
      : null
  );
}

const mapStateToProps = state => {
  return {
    user: state.user.user,
  };
};

export default connect(mapStateToProps)(LogOut);
