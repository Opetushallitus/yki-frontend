import i18next from 'i18next';
import moment from 'moment';

import {
  DATE_FORMAT,
  ISO_DATE_FORMAT_SHORT,
  LANGUAGES,
} from '../common/Constants';

export const capitalize = s =>
  s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

export const levelTranslations = {
  PERUS: 'common.level.basic',
  KESKI: 'common.level.middle',
  YLIN: 'common.level.high',
};

export const evaluationTexts = {
  READING: 'registration.description.read',
  WRITING: 'registration.description.write',
  LISTENING: 'registration.description.listen',
  SPEAKING: 'registration.description.speak',
};

export const formatPriceObject = (pricesObj, translationObj) => {
  const priceArray = [];
  for (const key in pricesObj) {
    if (Object.hasOwnProperty.call(pricesObj, key)) {
      priceArray.push({
        title: i18next.t(translationObj[key]),
        price: parseInt(pricesObj[key]),
        key,
      });
    }
  }
  return priceArray;
};

export const levelDescription = level => {
  return i18next.t(levelTranslations[level]);
};

export const languageToString = lang => {
  const found = LANGUAGES.find(l => l.code === lang);
  return found ? found.name : '';
};

export const languagesToString = array => {
  const list = getLanguagesWithLevelDescriptions(array);
  return list.map(lang => lang.split(' ')[0].toLowerCase()).join(', ');
};

export const getLanguagesWithLevelDescriptions = array => {
  const list = [];
  for (const lang in LANGUAGES) {
    const language = LANGUAGES[lang];
    const levels = array
      .filter(l => l.language_code === language.code)
      .map(l => l.level_code)
      .reduce((acc, l) => acc.concat(l), []);

    if (levels.length > 0) {
      const description =
        levels.length === language.levels.length
          ? i18next.t('common.level.all')
          : levels
              .map(l => levelDescription(l))
              .join(` ${i18next.t('common.and')} `);
      list.push(`${language.name} - ${capitalize(description)}`);
    }
  }
  return list;
};

export const inRegistryOrExamSessions = () => {
  return (
    window.location.href.includes('jarjestajarekisteri') ||
    window.location.href.includes('tutkintotilaisuudet')
  );
};

export const nowBetweenDates = (startDate, endDate) => {
  const now = moment(new Date());
  return now.isBetween(startDate, endDate, 'day', '[]');
};

export const getObjectValuesCount = object => {
  const valuesArray = Object.values(object);
  let result = 0;

  for (let key in valuesArray) {
    if (valuesArray.hasOwnProperty(key)) {
      let value = valuesArray[key];
      result += value.length;
    }
  }
  return result;
};

export const getArraySize = array => {
  if (!array) return 0;
  return array.length;
};

export const getLanguageAndLevel = sessionData => {
  return `${i18next.t(
    `common.language.${sessionData.language_code}`,
  )}, ${levelDescription(sessionData.level_code)}`;
};

export const getDeviceOrientation = () => {
  if (window.screen.orientation) {
    return window.screen.orientation.type.includes('landscape')
      ? 'landscape'
      : 'portrait';
  }

  // iOS/safari
  return Math.abs(+window.orientation) === 90 ? 'landscape' : 'portrait';
};

export const isoFormatDate = stringDate =>
  moment(stringDate, DATE_FORMAT).format(ISO_DATE_FORMAT_SHORT);

export const sortObjectArray = (arr, sortBy, asc) => {
  const sortedArray = arr.sort((a, b) =>
    a[sortBy] > b[sortBy] ? 1 : b[sortBy] > a[sortBy] ? -1 : 0,
  );

  return asc ? sortedArray : sortedArray.reverse();
};

export const checkTodayIsBetween = (before, after) => {
  const today = moment();
  const formatBefore = moment(before);
  const formatAfter = moment(after);

  return today >= formatBefore && today <= formatAfter;
};

export const compareDates = (a, b) => {
  const start = moment(a);
  const end = moment(b);

  return end >= start;
};
