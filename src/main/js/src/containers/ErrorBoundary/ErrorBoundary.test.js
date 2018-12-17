import React from 'react';
import axios from '../../axios';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { ErrorBoundary } from './ErrorBoundary';
import Alert from '../../components/Alert/Alert';

// suppress expected errors
console.error = jest.fn();

const errorMsg = 'test error';

const childrenClass = 'children';

configure({ adapter: new Adapter() });

const ComponentWithError = () => {
  throw new Error(errorMsg);
};

const ComponentWithoutError = () => {
  return <div className={childrenClass} />;
};

describe('<ErrorBoundary />', () => {
  it('should render Alert component and post error to backend when error is caught', () => {
    jest.spyOn(axios, 'post');

    let wrapper = mount(
      <ErrorBoundary t={key => key} titleKey="error" returnLinkTo="/" returnLinkTextKey="error">
        <ComponentWithError />
      </ErrorBoundary>,
    );
    expect(wrapper.find('.' + childrenClass).exists()).toBeFalsy();
    expect(wrapper.find(Alert).exists()).toBeTruthy();
    expect(axios.post).toBeCalledWith('/yki/log', {
      message: errorMsg,
      stack: expect.any(String),
      pathname: expect.any(String),
    });
  });

  it('should render children when no errors', () => {
    let wrapper = mount(
      <ErrorBoundary title="error" returnLinkTo="/" returnLinkText="error">
        <ComponentWithoutError />
      </ErrorBoundary>,
    );
    expect(wrapper.find('.' + childrenClass).exists()).toBeTruthy();
  });
});
