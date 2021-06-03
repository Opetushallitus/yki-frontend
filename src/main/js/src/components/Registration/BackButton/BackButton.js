import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';

import classes from './BackButton.module.css';

const backButton = ({ buttonText, href }) => {
  const { t } = useTranslation();

  return (
    <div style={{ paddingTop: '1.5rem' }}>
      <a className={classes.Return} href={href}>
        {buttonText ? buttonText : t('registration.return')}
      </a>
    </div>
  );
};

backButton.propTypes = {
  clicked: PropTypes.func.isRequired,
  buttonText: PropTypes.string,
};

export default backButton;
