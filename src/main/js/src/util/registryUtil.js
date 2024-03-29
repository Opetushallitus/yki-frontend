import { capitalize } from './util';

export const collectRegistryItemDetails = (organizer, organization, lang) => {
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
  item.name = getLocalizedName(organization.nimi, lang);
  item.website = getWebsite(organization.yhteystiedot);
  item.agreement = getAgreementDuration(organizer);
  item.address = getAddress(organization);
  item.contact = getContact(organizer);
  item.languages = organizer.languages || [];
  item.extra = organizer.extra || '';

  return item;
};

export const getLocalizedName = (namesObj, lang) => {
  if (Object.keys(namesObj).length === 1) {
    return Object.values(namesObj)[0];
  } else {
    if (namesObj[lang]) {
      return namesObj[lang];
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
  return `${address.street}, ${address.zipCode} ${capitalize(address.city)}`;
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
    start: organizer.agreement_start_date,
    end: organizer.agreement_end_date,
  };
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

export const filterByNameOrLocation = (array, value) => {
  const values = new Set();

  array
    .filter(i =>
      i.organization.nimet.some(n =>
        Object.values(n.nimi)[0]
          .toLowerCase()
          .includes(value.toLowerCase()),
      ),
    )
    .map(i => values.add(i));

  array
    .filter(i =>
      i.organization.postiosoite.postitoimipaikka
        .toLowerCase()
        .includes(value.toLowerCase()),
    )
    .map(i => values.add(i));

  return [...values];
};

export const filterByLanguage = (array, value) => {
  return array.filter(i =>
    i.organizer.languages
      ? i.organizer.languages.some(l => l.language_code === value)
      : false,
  );
};

export const filterByLevel = (array, value) => {
  return array.filter(i =>
    i.organizer.languages
      ? i.organizer.languages.some(l => l.level_code === value)
      : false,
  );
};
