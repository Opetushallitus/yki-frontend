import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { PaymentStatus } from './PaymentStatus';
import Spinner from '../../components/UI/Spinner/Spinner';
import ExamDetailsCard from '../../components/Registration/ExamDetailsPage/ExamDetailsCard/ExamDetailsCard';
import * as i18nKeys from "../../common/LocalizationKeys";

configure({ adapter: new Adapter() });

describe('<PaymentStatus />', () => {
  it('should render payment status success', () => {
    const wrapper = shallow(
      <PaymentStatus
        returnUrl='/#'
        t={key => key}
        user={{ email: 'test@test.com' }}
        location={{ search: '?status=payment-success' }}
      />,
    );
    const wrapperHeader = wrapper.find('HeadlineContainer');
    expect(wrapperHeader.props().headlineTitle).toBe('email.payment_success.subject!');
  });
  it('should render exam details when url contains id query param', () => {
    const wrapper = shallow(
      <PaymentStatus
        returnUrl='/#'
        t={key => key}
        user={{ email: 'test@test.com' }}
        location={{ search: '?status=payment-success&id=1' }}
      />,
    );
    expect(wrapper.find(Spinner).exists()).toBeTruthy();
    wrapper.setState({ loading: false, examSession: {} });
    expect(wrapper.find(Spinner).exists()).toBeFalsy();

    const wrapperHeader = wrapper.find('HeadlineContainer');
    expect(wrapperHeader.props().headlineContent.type.name).toBe('ExamDetailsCard');
    expect(wrapperHeader.props().headlineTitle).toBe('email.payment_success.subject!');
  });
  it('should render payment status error', () => {
    const wrapper = shallow(
      <PaymentStatus
        returnUrl='/#'
        t={key => key}
        location={{ search: '?status=payment-error' }}
      />,
    );
    const wrapperHeader = wrapper.find('HeadlineContainer');

    expect(wrapperHeader.props().headlineTitle).toBe(i18nKeys.payment_status_error);
  });
  it('should render payment status cancel', () => {
    const wrapper = shallow(
      <PaymentStatus
        returnUrl='/#'
        t={key => key}
        location={{ search: '?status=payment-cancel' }}
      />,
    );
    const wrapperHeader = wrapper.find('HeadlineContainer');

    expect(wrapperHeader.props().headlineTitle).toBe(i18nKeys.payment_status_cancel);
  });
});
