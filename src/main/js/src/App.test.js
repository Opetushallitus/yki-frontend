import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { StaticRouter } from 'react-router-dom';

it('renders without crashing', () => {
  const div = document.createElement('div');

  const app = (
    <StaticRouter>
      <App />
    </StaticRouter>
  );

  ReactDOM.render(app, div);
  ReactDOM.unmountComponentAtNode(div);
});
