import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';

import { linkExpired as LinkExpired } from './LinkExpired';

configure({ adapter: new Adapter() });

describe('<LinkExpired />', () => {
  it('should render link expired page', () => {
    const wrapper = shallow(
      <LinkExpired
        t={key => key}
        match={{ path: '/ilmoittautuminen/vanhentunut' }}
        history={history}
      />,
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
