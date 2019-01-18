import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { paymentStatus as PaymentStatus } from './PaymentStatus';
import Alert from '../Alert/Alert';

configure({ adapter: new Adapter() });

describe('<PaymentStatus />', () => {
  it('should render payment status success', () => {
    const wrapper = shallow(
      <PaymentStatus t={key => key} location={{search: "?status=payment-success"}} />,
    );
    expect(wrapper.find(Alert).prop('title')).toBe('payment.status.success');
  });
  it('should render payment status error', () => {
    const wrapper = shallow(
      <PaymentStatus t={key => key} location={{search: "?status=payment-error"}} />,
    );
    expect(wrapper.find(Alert).prop('title')).toBe('payment.status.error');
  });
  it('should render payment status cancel', () => {
    const wrapper = shallow(
      <PaymentStatus t={key => key} location={{search: "?status=payment-cancel"}} />,
    );
    expect(wrapper.find(Alert).prop('title')).toBe('payment.status.cancel');
  });
});
