import React from 'react';
import {configure, mount} from 'enzyme';

import Adapter from 'enzyme-adapter-react-16';
import {Provider} from 'react-redux';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import ykiReducer from '../../store/reducers/ykiReducer';

import LanguageSelect from './LanguageSelect';

configure({adapter: new Adapter()});

describe('<LanguageSelect />', () => {
  it('should call change language state with swedish language code', () => {
    const mockStore = createStore(combineReducers({yki: ykiReducer}), applyMiddleware(thunk));

    const wrapper = mount(
       <Provider store={mockStore}>
        <LanguageSelect setCollapsibleOpen={() =>  {}} />
       </Provider>
    );

    const swedishButton = wrapper.find('button').at(1);

    swedishButton.simulate('click');
    expect(wrapper.props().store.getState().yki.ykiLanguage).toBe('sv');
  });

  it('should call change language state with english language code', () => {
    const mockStore = createStore(combineReducers({yki: ykiReducer}), applyMiddleware(thunk));

    const wrapper = mount(
        <Provider store={mockStore}>
            <LanguageSelect setCollapsibleOpen={() =>  {}} />
        </Provider>
    );

    const englishButton = wrapper.find('button').at(2);

    englishButton.simulate('click');
    expect(wrapper.props().store.getState().yki.ykiLanguage).toBe('en');
  });
});