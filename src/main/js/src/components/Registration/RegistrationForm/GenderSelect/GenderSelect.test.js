import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';

import { genderSelect as GenderSelect } from './GenderSelect';

configure({ adapter: new Adapter() });

describe('<GenderSelect />', () => {
  it('should render gender selection sorted by code', () => {
    const genders = [
      {
        koodiArvo: '2',
        metadata: [
          {
            nimi: 'nainen',
            kieli: 'FI',
          },
        ],
      },
      {
        koodiArvo: '1',
        metadata: [
          {
            nimi: 'mies',
            kieli: 'FI',
          },
        ],
      },
    ];

    const wrapper = shallow(
      <GenderSelect
        t={key => key}
        lng={'fi'}
        genders={genders}
        className="test"
      />,
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
