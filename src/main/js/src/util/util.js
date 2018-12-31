import i18next from 'i18next';

export const firstCharToUpper = string => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const levelTranslations = {
  PERUS: i18next.t('common.level.basic'),
  KESKI: i18next.t('common.level.middle'),
  YLIN: i18next.t('common.level.high'),
};

export const levelDescription = level => {
  return levelTranslations[level];
};
