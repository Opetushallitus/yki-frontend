import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import classes from './BackButton.module.css';

const backButton = ({ clicked, buttonText }) => {
  const { t } = useTranslation();

  return (
    <button className={classes.Return} onClick={clicked} role="link">
      {buttonText ? buttonText : t('registration.return')}
    </button>
  );
};

backButton.propTypes = {
  clicked: PropTypes.func.isRequired,
  buttonText: PropTypes.string
};

export default backButton;
