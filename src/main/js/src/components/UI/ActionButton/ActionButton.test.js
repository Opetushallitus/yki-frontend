import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import ActionButton from './ActionButton';

configure({ adapter: new Adapter() });

describe('<ActionButton />', () => {
  it('should show action button when confirming is false', () => {
    const wrapper = shallow(
      <ActionButton
        onClick={jest.fn()}
        children={'delete'}
        confirmText={'confirm'}
        cancelText={'cancel'}
      />,
    );
    expect(wrapper.find('.Action').exists()).toBeTruthy();
    expect(wrapper.find('.ActionLeft').exists()).toBeFalsy();
    expect(wrapper.find('.ActionRight').exists()).toBeFalsy();
  });
  it('should show confirm and cancel buttons when confirming is true', () => {
    const wrapper = shallow(
      <ActionButton
        onClick={jest.fn()}
        children={'delete'}
        confirmText={'confirm'}
        cancelText={'cancel'}
      />,
    );
    wrapper.setState({ confirming: true });
    expect(wrapper.find('.Action').exists()).toBeFalsy();
    expect(wrapper.find('.ActionLeft').exists()).toBeTruthy();
    expect(wrapper.find('.ActionRight').exists()).toBeTruthy();
  });
});
