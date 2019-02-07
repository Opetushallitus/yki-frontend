import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';

import { nationalitySelect as NationalitySelect } from './NationalitySelect';

configure({ adapter: new Adapter() });

describe('<NationalitySelect />', () => {
  it('should render natonality selection sorted alphabetically', () => {
    const nationalities = [
      {
        koodiArvo: '158',
        metadata: [
          {
            nimi: 'Taiwan',
            kieli: 'FI',
          },
        ],
      },
      {
        koodiArvo: '064',
        metadata: [
          {
            nimi: 'Bhutan',
            kieli: 'FI',
          },
        ],
      },
    ];

    const wrapper = shallow(
      <NationalitySelect
        t={key => key}
        lng={'fi'}
        nationalities={nationalities}
        className="test"
      />,
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
