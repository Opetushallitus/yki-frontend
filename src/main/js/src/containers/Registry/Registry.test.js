import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { Registry } from './Registry';
import Spinner from '../../components/UI/Spinner/Spinner';
import Modal from '../../components/UI/Modal/Modal';

configure({ adapter: new Adapter() });

describe('<Registry />', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(
      <Registry
        onFetchRegistryContent={() => {}}
        registry={[]}
        loading={false}
        localization={'fi'}
      />,
    );
  });

  it('should render <Spinner /> when loading', () => {
    wrapper.setProps({ loading: true });
    wrapper.setState({ showModal: true }); // trigger shouldComponentUpdate to update props
    expect(wrapper.find(Spinner)).toHaveLength(1);
  });

  it('should render <Modal /> for adding a new item to registry', () => {
    expect(wrapper.find(Modal)).toHaveLength(1);
  });
});
