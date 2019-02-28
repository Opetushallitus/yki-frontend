import React from 'react';
import { useTranslation } from 'react-i18next';
import * as R from 'ramda';

import classes from './LanguageSelect.module.css';

const languageSelect = props => {
  const texts = { fi: 'suomeksi', sv: 'på svenska', en: 'in english' };
  const languages = ['fi', 'sv', 'en'];
  const { i18n } = useTranslation();

  const languageLinks = () => {
    const langs = languages
      .filter(l => l !== i18n.language)
      .map(lang => (
        <span
          className={classes.LanguageSelect}
          key={lang}
          onClick={() => i18n.changeLanguage(lang)}
        >
          {texts[lang]}
        </span>
      ));
    return R.insert(1, <span className={classes.Separator}>|</span>, langs);
  };
  return <React.Fragment>{languageLinks()}</React.Fragment>;
};

export default languageSelect;
