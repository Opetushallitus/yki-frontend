import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { participantList as ParticipantList } from './ParticipantList';

configure({ adapter: new Adapter() });

const examSession = {
  registration_end_date: '2028-12-15',
  session_date: '2028-12-30',
  participants: 2,
  max_participants: 50,
  registration_start_date: '2018-09-01',
  language_code: 'eng',
  level_code: 'KESKI',
};

const participants = [
  {
    form: {
      post_office: 'Espoo',
      ssn: '011088-1234 ',
      phone_number: '+358405131441',
      email: 'michael.wallis@test.com',
      last_name: 'Michael',
      first_name: 'Wallis',
      street_address: 'Revontulentie 13 C 2',
      zip: '02100',
    },
    state: 'COMPLETED',
  },
  {
    form: {
      post_office: 'Espoo',
      ssn: '011088-1234 ',
      phone_number: '+358405131441',
      email: 'natalia.gaddens@test.com',
      last_name: 'Natalia',
      first_name: 'Gaddens',
      street_address: 'Revontulentie 13 C 2',
      zip: '02100',
    },
    state: 'SUBMITTED',
  },
];

describe('<ParticipantList />', () => {
  it('should render participant rows', () => {
    const wrapper = shallow(
      <ParticipantList
        examSession={examSession}
        participants={participants}
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
