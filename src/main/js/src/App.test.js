import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { StaticRouter } from 'react-router-dom';

jest.mock('react-i18next', () => ({
  withTranslation: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: k => k };
    return Component;
  },
  useTranslation: () => {
    return { i18n: { language: 'fi', changeLanguage: jest.fn() }, t: k => k };
  },
}));

it('renders without crashing', () => {
  const div = document.createElement('div');
  window.history.pushState({}, 'yki', '/yki/'); // stop console warnings from using basename

  const app = (
    <StaticRouter context={{}}>
      <App />
    </StaticRouter>
  );

  ReactDOM.render(app, div);
  ReactDOM.unmountComponentAtNode(div);
});
