import i18next from 'i18next';
import moment from 'moment';

import {
  DATE_FORMAT,
  ISO_DATE_FORMAT_SHORT,
  LANGUAGES,
} from '../common/Constants';
import * as i18nKeys from "../common/LocalizationKeys";

export const capitalize = s =>
  s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

export const levelTranslations = {
  PERUS: i18nKeys.common_level_basic,
  KESKI: i18nKeys.common_level_middle,
  YLIN: i18nKeys.common_level_high,
};

export const evaluationTexts = {
  READING: i18nKeys.registration_description_read,
  WRITING: i18nKeys.registration_description_write,
  LISTENING: i18nKeys.registration_description_listen,
  SPEAKING: i18nKeys.registration_description_speak,
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
          ? i18next.t(i18nKeys.common_level_all)
          : levels
              .map(l => levelDescription(l))
              .join(` ${i18next.t(i18nKeys.common_and)} `);
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
  const languageCodeToTranslationKey = {
    'fin': i18nKeys.common_language_fin,
    'swe': i18nKeys.common_language_swe,
    'eng': i18nKeys.common_language_eng
  };
  const langKey = languageCodeToTranslationKey[sessionData.language_code];
  return `${i18next.t(langKey)}, ${levelDescription(sessionData.level_code)}`;
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

export const containsSpecialCharacters = str => /[*+.;,_&@']/.test(str);

export function checkBirthDate(value) {
  if (value) {
    const date = moment(value, DATE_FORMAT, true);
    const duration = moment.duration(moment().diff(date));
    const years = duration.asYears();
    const ageOk = years > 1 && years < 105;

    if (date.isValid() && date.isBefore(moment()) && ageOk) {
      return { error: null };
    } else {
      return {
        error: i18next.t(!date.isValid() ? i18nKeys.error_birthdate : i18nKeys.error_age),
      };
    }
  } else {
    return {
      error: i18next.t(i18nKeys.error_mandatory),
    };
  }
}
