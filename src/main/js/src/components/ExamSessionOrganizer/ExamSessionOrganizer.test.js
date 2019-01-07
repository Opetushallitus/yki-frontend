import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { examSessionOrganizer as ExamSessionOrganizer } from './ExamSessionOrganizer';

configure({ adapter: new Adapter() });

const organization = {
  oid: '1.2.246.562.10.28646781494',
  nimi: { fi: 'Amiedu' },
  postiosoite: {
    postinumeroUri: 'posti_00381',
    osoiteTyyppi: 'posti',
    yhteystietoOid: '1.2.246.562.5.72680991303',
    postitoimipaikka: 'HELSINKI',
    osoite: 'PL 151',
  },
  yhteystiedot: [],
};

const organizer = {
  oid: '1.2.246.562.10.28646781493',
  agreement_start_date: '2018-01-01',
  agreement_end_date: '2019-01-01',
  contact_name: 'Iida Ikola',
  contact_email: 'iida.ikola@amiedu.fi',
  contact_phone_number: '0101234546',
  languages: [
    {
      language_code: 'fin',
      level_code: 'PERUS',
    },
  ],
  extra: null,
};

describe('<ExamSessionOrganizer />', () => {
  it('should render agreement and contact details', () => {
    const wrapper = shallow(
      <ExamSessionOrganizer
        t={key => key}
        organizer={organizer}
        organization={organization}
      />,
    );
    expect(wrapper.find('.Languages').exists()).toBeTruthy();
    expect(wrapper.find('.Contact').exists()).toBeTruthy();
  });
});
