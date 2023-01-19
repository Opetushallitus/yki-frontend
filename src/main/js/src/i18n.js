import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import translationEN from './assets/localisation/translations_en.json';
import translationFI from './assets/localisation/translations_fi.json';
import translationSV from './assets/localisation/translations_sv.json';

const resources = {
  en: {
    yki: translationEN,
  },
  fi: {
    yki: translationFI,
  },
  sv: {
    yki: translationSV,
  },
};

const detection = {
  order: ['querystring'],
  lookupQuerystring: 'lang',
};

i18n
  //  https://www.i18next.com/overview/configuration-options
  .use(initReactI18next)
  // https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  .init({
    ns: 'yki',
    resources,
    detection,
    fallbackLng: 'fi',
    debug: false,
    keySeparator: '|', // override default to be able to use dots in keys
  });

export default i18n;
