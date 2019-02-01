import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';

import { registrationForm as RegistrationForm } from './RegistrationForm';

configure({ adapter: new Adapter() });

const examSession = {
  registration_end_date: '2025-12-15',
  session_date: '2028-05-30',
  participants: 0,
  max_participants: 30,
  registration_start_date: '2028-03-01',
  language_code: 'fin',
  level_code: 'PERUS',
};

const initData = {
  user: {
    last_name: 'Parkkonen-Testi',
    nick_name: null,
    ssn: '260553-959D',
    post_office: 'HELSINKI',
    street_address: 'Ateläniitynpolku 29 G',
    first_name: 'Carl-Erik',
    zip: '00100',
    nationalities: ['246'],
  },
};
describe('<RegistrationForm />', () => {
  it('should render registration form', () => {
    const wrapper = mount(
      <RegistrationForm
        t={key => key}
        initData={initData}
        submitting={false}
        onSubmitRegistrationForm={jest.fn()}
      />,
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
