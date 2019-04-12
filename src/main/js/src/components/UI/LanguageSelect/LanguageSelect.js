import React from 'react';
import { useTranslation } from 'react-i18next';

import classes from './LanguageSelect.module.css';

const texts = { fi: 'suomeksi', sv: 'på svenska', en: 'in english' };
const languages = ['fi', 'sv', 'en'];

const languageSelect = () => {
  const { i18n, t } = useTranslation();

  const languageLinks = () => {
    return languages
      .filter(l => l !== i18n.language)
      .map(lang => (
        <span key={lang}>
          <button
            className={classes.LanguageSelect}
            onClick={() => i18n.changeLanguage(lang)}
          >
            {texts[lang]}
          </button>
        </span>
      ));
  };
  return (
    <React.Fragment>
      {t('feature.languageSelect.disable') !== 'true' && languageLinks()}
    </React.Fragment>
  );
};

export default languageSelect;
