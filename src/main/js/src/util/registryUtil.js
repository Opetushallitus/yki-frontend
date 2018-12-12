import moment from 'moment';

import { DATE_FORMAT, LANGUAGES, CODE_TO_LEVEL } from '../common/Constants';
import { firstCharToUpper } from './util';

export const collectRegistryItemDetails = (
  organizer,
  organization,
  localization,
) => {
  const item = {
    oid: '',
    name: '',
    website: '',
    agreement: {
      start: '',
      end: '',
    },
    address: {
      street: '',
      zipCode: '',
      city: '',
    },
    contact: {
      name: '',
      phone: '',
      email: '',
    },
    languages: [],
    extra: '',
  };

  item.oid = organization.oid;
  item.name = getLocalizedName(organization.nimi, localization);
  item.website = getWebsite(organization.yhteystiedot);
  item.agreement = getAgreementDuration(organizer);
  item.address = getAddress(organization);
  item.contact = getContact(organizer);
  item.languages = getLanguages(organizer.languages);
  item.extra = getExtra(organizer);

  return item;
};

export const getLocalizedName = (namesObj, localization) => {
  if (Object.keys(namesObj).length === 1) {
    return Object.values(namesObj)[0];
  } else {
    if (namesObj[localization]) {
      return namesObj[localization];
    }
    const name = [namesObj['fi'], namesObj['en'], namesObj['sv']].filter(
      o => o,
    )[0];
    return name ? name : '-';
  }
};

const getWebsite = contactInformation => {
  const wwwObj = contactInformation.find(org => {
    return org.www;
  });
  return wwwObj && wwwObj.www ? wwwObj.www : '-';
};

export const getCompleteAddress = organization => {
  const address = getAddress(organization);
  return `${address.street}, ${address.zipCode} ${firstCharToUpper(
    address.city,
  )}`;
};

const getAddress = organization => {
  return {
    street: organization.postiosoite.osoite
      ? organization.postiosoite.osoite
      : '<postiosoite puuttuu>',
    zipCode: organization.postiosoite.postinumeroUri
      ? organization.postiosoite.postinumeroUri.split('_').pop()
      : '',
    city: organization.postiosoite.postitoimipaikka
      ? organization.postiosoite.postitoimipaikka
      : '',
  };
};

const getContact = organizer => {
  return {
    name: organizer.contact_name ? organizer.contact_name : '',
    phone: organizer.contact_phone_number ? organizer.contact_phone_number : '',
    email: organizer.contact_email ? organizer.contact_email : '',
  };
};

const getAgreementDuration = organizer => {
  return {
    start: organizer.agreement_start_date
      ? moment(organizer.agreement_start_date).format(DATE_FORMAT)
      : '',
    end: organizer.agreement_end_date
      ? moment(organizer.agreement_end_date).format(DATE_FORMAT)
      : '',
  };
};

const getLanguages = languageList => {
  return languageList ? languageList : [];
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
          ? 'kaikki tasot'
          : levels.map(l => CODE_TO_LEVEL[l]).join(' ja ');
      list.push(`${language.name} - ${firstCharToUpper(description)}`);
    }
  }
  return list;
};

const getExtra = item => {
  return item.extra ? item.extra : '';
};

export const sortArrayByName = array => {
  array.sort((a, b) => {
    try {
      const nameA = [a.nimi.fi, a.nimi.en, a.nimi.sv]
        .filter(n => n)[0]
        .toLowerCase();
      const nameB = [b.nimi.fi, b.nimi.en, b.nimi.sv]
        .filter(n => n)[0]
        .toLowerCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    } catch (error) {
      return 0;
    }
  });
};

export const isAgreementActive = (agreementStartDate, agreementEndDate) => {
  const start = moment(agreementStartDate, DATE_FORMAT);
  const now = moment(new Date());
  const end = moment(agreementEndDate, DATE_FORMAT);

  return now.isBetween(start, end, 'day', '[]');
};