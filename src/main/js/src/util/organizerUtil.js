import moment from 'moment';

import * as constants from '../common/Constants';

export const filterOrganizerInfo = (organizer, organization, localization) => {
  const org = {
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
      altEmail: '',
    },
    languages: [],
  };

  org.name = getLocalizedName(organization.nimi, localization);
  org.website = getWebsite(organization.yhteystiedot);
  org.agreement = getAgreementPeriod(organizer);
  org.address = getAddress(organization);
  org.contact = getContact(organizer);
  for (const lang in organizer.languages) {
    getLanguage(organizer.languages[lang], org.languages);
  }

  return org;
};

export const getLocalizedName = (namesObj, lang) => {
  if (Object.keys(namesObj).length === 1) {
    return Object.values(namesObj)[0];
  } else {
    if (namesObj[lang]) {
      return namesObj[lang];
    } else {
      if (namesObj['fi']) {
        return namesObj['fi'];
      }
      if (namesObj['en']) {
        return namesObj['en'];
      }
      if (namesObj['sv']) {
        return namesObj['sv'];
      }
      return 'No Name Found';
    }
  }
};

const getWebsite = contactInformation => {
  const wwwObj = contactInformation.find(org => {
    return org.www;
  });
  return wwwObj && wwwObj.www ? wwwObj.www : '-';
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
      ? ' ' + organization.postiosoite.postitoimipaikka
      : '',
  };
};

const getContact = organizer => {
  return {
    name: organizer.contact_name ? organizer.contact_name : '',
    phone: organizer.contact_phone_number ? organizer.contact_phone_number : '',
    email: organizer.contact_email ? organizer.contact_email : '',
    altEmail: organizer.contact_shared_email
      ? organizer.contact_shared_email
      : '',
  };
};

const getAgreementPeriod = organizer => {
  return {
    start: organizer.agreement_start_date
      ? moment(organizer.agreement_start_date).format(constants.DATE_FORMAT)
      : '',
    end: organizer.agreement_end_date
      ? moment(organizer.agreement_end_date).format(constants.DATE_FORMAT)
      : '',
  };
};

const getLanguage = (lang, languages) => {
  const languageCodeToLanguage = {
    fi: 'suomi',
    sv: 'ruotsi',
    en: 'englanti',
    es: 'espanja',
    it: 'italia',
    fr: 'ranska',
    se: 'ruotsi',
    de: 'saksa',
    ru: 'venäjä',
  };
  const levelCodeToLevel = {
    PERUS: 'perustaso',
    KESKI: 'keskitaso',
    YLIN: 'ylin taso',
  };
  if (
    languageCodeToLanguage[lang.language_code] &&
    levelCodeToLevel[lang.level_code]
  ) {
    languages.push({
      name: languageCodeToLanguage[lang.language_code],
      level: levelCodeToLevel[lang.level_code],
    });
  }
};
