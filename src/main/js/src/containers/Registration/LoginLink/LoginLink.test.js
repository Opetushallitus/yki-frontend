import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';

import { LoginLink } from './LoginLink';

configure({ adapter: new Adapter() });


describe('<LoginLink />', () => {
  it('should render login link page', () => {
    const wrapper = mount(
      <LoginLink
        examSessionId={1}
        t={t => t}
      />,
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
