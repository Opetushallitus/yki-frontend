import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import LanguageSelect from './LanguageSelect';

configure({ adapter: new Adapter() });

const mockFn = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return { i18n: { language: 'fi', changeLanguage: mockFn } };
  },
}));

describe('<LanguageSelect />', () => {
  it('should call i18next changeLanguage with language code', () => {
    const wrapper = mount(<LanguageSelect />);
    const swedishSelect = wrapper.find('.LanguageSelect').first();
    swedishSelect.simulate('click');
    expect(mockFn.mock.calls[0][0]).toBe('sv');
  });
});
