import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { navigationItems as NavigationItems } from './NavigationItems';
import NavigationItem from './NavigationItem/NavigationItem';

configure({ adapter: new Adapter() });

jest.mock('react-i18next', () => ({
  withTranslation: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: () => '' };
    return Component;
  },
}));

describe('<NavigationItems />', () => {
  it('should render two <NavigationItem /> elements for admin', () => {
    const wrapper = shallow(<NavigationItems user={{ isAdmin: true }} />);
    expect(wrapper.find(NavigationItem)).toHaveLength(2);
  });
  it('should render one <NavigationItem /> element for organizer', () => {
    const wrapper = shallow(<NavigationItems user={{ isAdmin: false }} />);
    expect(wrapper.find(NavigationItem)).toHaveLength(1);
  });
});
