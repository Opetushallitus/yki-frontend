import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';

import { registrationForm as RegistrationForm } from './RegistrationForm';

configure({ adapter: new Adapter() });

jest.mock('react-i18next', () => ({
  withTranslation: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: () => '' };
    return Component;
  },
}));

const initData = {
  user: {
    last_name: 'Parkkonen-Testi',
    nick_name: null,
    ssn: '260553-959D',
    post_office: 'HELSINKI',
    street_address: 'Ateläniitynpolku 29 G',
    first_name: 'Carl-Erik',
    zip: '00100',
    nationalities: ['246'],
  },
  exam_session: {
    language_code: 'eng',
  },
};
describe('<RegistrationForm />', () => {
  it('should render registration form', () => {
    const wrapper = shallow(
      <RegistrationForm
        t={key => key}
        i18n={{lang: 'fi'}}
        initData={initData}
        submitting={false}
        onSubmitRegistrationForm={jest.fn()}
      />,
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
