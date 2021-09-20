import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';

import classes from './BackButton.module.css';
import * as i18nKeys from "../../../common/LocalizationKeys";

const backButton = ({ buttonText, href }) => {
  const { t } = useTranslation();

  return (
    <div style={{ paddingTop: '1.5rem' }}>
      <a className={classes.Return} href={href}>
        {buttonText ? buttonText : t(i18nKeys.registration_return)}
      </a>
    </div>
  );
};

backButton.propTypes = {
  href: PropTypes.string.isRequired,
  buttonText: PropTypes.string,
};

export default backButton;
