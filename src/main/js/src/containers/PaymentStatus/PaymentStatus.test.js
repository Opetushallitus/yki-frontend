import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { PaymentStatus } from './PaymentStatus';
import Spinner from '../../components/UI/Spinner/Spinner';
import HeadlineContainer from "../../components/HeadlineContainer/HeadlineContainer";
import ExamDetailsCard from '../../components/Registration/ExamDetailsPage/ExamDetailsCard/ExamDetailsCard';

configure({ adapter: new Adapter() });

describe('<PaymentStatus />', () => {

  it('should render payment status success', () => {
    const wrapper = shallow(
      <PaymentStatus
        renderSuccessHeadline={(examSession) =>
          <HeadlineContainer
            headlineTitle={'msg.title'}
            headlineContent={<ExamDetailsCard />}
          />
        }
        successContent={<>content</>}
        cancelMessage={'msg.fail'}
        failMessage={'msg.cancel'}
        entityUrl={'/yki/exam'}
        returnUrl='/'
        t={key => key}
        user={{ email: 'test@test.com' }}
        location={{ search: '?status=payment-success' }}
      />,
    );
    const wrapperHeader = wrapper.find('HeadlineContainer');
    expect(wrapperHeader.props().headlineTitle).toBe('msg.title');
  });

  it('should render exam details when url contains id query param', () => {
    const wrapper = shallow(
      <PaymentStatus
        renderSuccessHeadline={(examSession) =>
          <HeadlineContainer
            headlineTitle={'msg.title'}
            headlineContent={<ExamDetailsCard />}
          />
        }
        successContent={<>content</>}
        cancelMessage={'msg.fail'}
        failMessage={'msg.cancel'}
        entityUrl={'/yki/exam'}
        returnUrl='/'
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
    expect(wrapperHeader.props().headlineTitle).toBe('msg.title');
  });

  it('should render payment status error', () => {
    const wrapper = shallow(
      <PaymentStatus
        renderSuccessHeadline={(examSession) =>
          <HeadlineContainer
            headlineTitle={'msg.title'}
            headlineContent={<ExamDetailsCard />}
          />
        }
        successContent={<>content</>}
        cancelMessage={'msg.fail'}
        failMessage={'msg.cancel'}
        entityUrl={'/yki/exam'}
        returnUrl='/'
        t={key => key}
        location={{ search: '?status=payment-error' }}
      />,
    );
    const wrapperHeader = wrapper.find('HeadlineContainer');

    expect(wrapperHeader.props().headlineTitle).toBe('payment.status.error');
  });

  it('should render payment status cancel', () => {
    const wrapper = shallow(
      <PaymentStatus
        renderSuccessHeadline={(examSession) =>
          <HeadlineContainer
            headlineTitle={'msg.title'}
            headlineContent={<ExamDetailsCard />}
          />
        }
        successContent={<>content</>}
        cancelMessage={'msg.fail'}
        failMessage={'msg.cancel'}
        entityUrl={'/yki/exam'}
        returnUrl='/'
        t={key => key}
        location={{ search: '?status=payment-cancel' }}
      />,
    );
    const wrapperHeader = wrapper.find('HeadlineContainer');

    expect(wrapperHeader.props().headlineTitle).toBe('payment.status.cancel');
  });
});
