import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';

import { registrationSuccess as RegistrationSuccess } from './RegistrationSuccess';

configure({ adapter: new Adapter() });

const examSession = 
  {
    registration_end_date: '2025-12-15',
    session_date: '2028-05-30',
    participants: 0,
    max_participants: 30,
    registration_start_date: '2028-03-01',
    language_code: 'fin',
    level_code: 'PERUS',
  };

describe('<RegistrationSuccess />', () => {
  it('should render registration success page', () => {
    const wrapper = shallow(
      <RegistrationSuccess t={key => key} initData={examSession} formData={{user: {email: 'test@test.com'}}}/>,
    );
   expect(toJson(wrapper)).toMatchSnapshot();
  });
});
