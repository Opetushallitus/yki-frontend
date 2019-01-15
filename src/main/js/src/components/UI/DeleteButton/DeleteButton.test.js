import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import DeleteButton from './DeleteButton';

configure({ adapter: new Adapter() });

describe('<DeleteButton />', () => {
  it('should show delete button when deleting is false', () => {
    const wrapper = shallow(
      <DeleteButton
        deleting={false}
        toggleDeleting={jest.fn()}
        onClick={jest.fn()}
        deleteText={'delete'}
        deleteConfirmText={'confirm'}
        deleteCancelText={'cancel'}
      />,
    );
    expect(wrapper.find('.Delete').exists()).toBeTruthy();
    expect(wrapper.find('.DeleteConfirmation').exists()).toBeFalsy();
    expect(wrapper.find('.DeleteCancel').exists()).toBeFalsy();
  });
  it('should show confirm and cancel buttons when deleting is true', () => {
    const wrapper = shallow(
      <DeleteButton
        deleting={true}
        toggleDeleting={jest.fn()}
        onClick={jest.fn()}
        deleteText={'delete'}
        deleteConfirmText={'confirm'}
        deleteCancelText={'cancel'}
      />,
    );
    expect(wrapper.find('.Delete').exists()).toBeFalsy();
    expect(wrapper.find('.DeleteConfirmation').exists()).toBeTruthy();
    expect(wrapper.find('.DeleteCancel').exists()).toBeTruthy();
  });
});