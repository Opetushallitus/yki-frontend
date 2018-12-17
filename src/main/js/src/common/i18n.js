import { store } from '../App';

const translate = key => {
  const localisation = store.getState().localisation;
  const translations = localisation.translations;
  const keyWithLang = `${key}.${localisation.lang}`;
  const translation = translations[keyWithLang];
  return translation ? translation : keyWithLang;
};

export default {
  t: translate,
};
