import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { RegistrationPage } from './RegistrationPage';

configure({ adapter: new Adapter() });

describe('<RegistrationPage />', () => {
  it('should render registration page and get initial form data', () => {
    const onInitRegistrationForm = jest.fn();
    const examSessionId = 9999;
    mount(
      <RegistrationPage
        match={{ params: { examSessionId: examSessionId } }}
        onInitRegistrationForm={onInitRegistrationForm}
      />,
    );
    expect(onInitRegistrationForm).toBeCalledWith(examSessionId);
  });
});
