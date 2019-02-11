import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { PaymentStatus } from './PaymentStatus';

configure({ adapter: new Adapter() });

describe('<PaymentStatus />', () => {
  it('should render payment status success', () => {
    const wrapper = shallow(
      <PaymentStatus
        t={key => key}
        user={{ email: 'test@test.com' }}
        location={{ search: '?status=payment-success' }}
      />,
    );
    expect(wrapper.find('h1').text()).toBe('payment.status.success');
  });
  it('should render payment status error', () => {
    const wrapper = shallow(
      <PaymentStatus
        t={key => key}
        location={{ search: '?status=payment-error' }}
      />,
    );
    expect(wrapper.find('h1').text()).toBe('payment.status.error');
  });
  it('should render payment status cancel', () => {
    const wrapper = shallow(
      <PaymentStatus
        t={key => key}
        location={{ search: '?status=payment-cancel' }}
      />,
    );
    expect(wrapper.find('h1').text()).toBe('payment.status.cancel');
  });
});
