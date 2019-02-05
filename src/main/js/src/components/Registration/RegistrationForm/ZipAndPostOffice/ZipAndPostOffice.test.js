import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { ZipAndPostOffice } from './ZipAndPostOffice';

configure({ adapter: new Adapter() });


describe('<ZipAndPostOffice />', () => {
  it('should render zip and post office inputs', () => {
    const values = {zip: '00100'};
    const setFieldValue = jest.fn();

    const wrapper = shallow(
      <ZipAndPostOffice
        t={key => key}
        values={values}
        setFieldValue={setFieldValue}
      />,
    );
    expect(wrapper.find('.Zip').exists()).toBeTruthy();
    expect(wrapper.find('.PostOffice').exists()).toBeTruthy();
  });
});
