import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';

import { participantList as ParticipantList } from './ParticipantList';

configure({ adapter: new Adapter() });

const examSessionFirst = {
  registration_end_date: '2028-12-15',
  session_date: '2028-12-30',
  participants: 2,
  max_participants: 50,
  pa_participants: 0,
  registration_start_date: '2018-09-01',
  language_code: 'eng',
  level_code: 'KESKI',
};

const examSessionSecond = {
  ...examSessionFirst,
  session_date: '2029-01-01',
  pa_participants: 0,
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
    registration_id: 1,
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
    registration_id: 2,
  },
];

// TODO Remove the below workaround, provide instead suitable Jest configs?
// Mock parsePhoneNumberFromString as jest for some reason can't seem to find the correct import.
jest.mock('libphonenumber-js', () => {
  return { parsePhoneNumberFromString: (_) => {
    return { formatInternational: () => '+358 40 5131441' }
  } }
});

describe('<ParticipantList />', () => {
  it('should render participant rows', () => {
    const wrapper = shallow(
      <ParticipantList
        examSession={examSessionFirst}
        examSessions={[examSessionFirst, examSessionSecond]}
        participants={participants}
        t={t => t}
        onCancel={jest.fn()}
        onConfirmPayment={jest.fn()}
        onRelocate={jest.fn()}
        onResendLink={jest.fn()}
      />,
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
