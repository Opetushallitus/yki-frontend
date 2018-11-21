import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import organizerReducer from './store/reducers/organizer';
import examSessionReducer from './store/reducers/examSession';
import registrationReducer from './store/reducers/registration';
import Layout from './hoc/Layout/Layout';
import OrganizerRegistry from './containers/OrganizerRegistry/OrganizerRegistry';
import ExamSessions from './containers/ExamSessions/ExamSessions';
import AddOrganizer from './containers/OrganizerRegistry/Organizer/AddOrganizer/AddOrganizer';
import NotFound from './components/NotFound/NotFound';

class App extends Component {
  render() {
    const rootReducer = combineReducers({
      registry: organizerReducer,
      exam: examSessionReducer,
      reg: registrationReducer,
    });

    // To enable https://github.com/zalmoxisus/redux-devtools-extension
    const composeEnhancers =
      process.env.NODE_ENV === 'development'
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        : null || compose;

    const store = createStore(
      rootReducer,
      composeEnhancers(applyMiddleware(thunk)),
    );

    return (
      <Provider store={store}>
        <BrowserRouter basename="/yki">
          <Layout>
            <Switch>
              <Redirect exact from="/" to="/jarjestajarekisteri" />
              <Route
                exact
                path="/jarjestajarekisteri"
                component={OrganizerRegistry}
              />
              <Route
                path="/jarjestajarekisteri/uusi"
                component={AddOrganizer}
              />
              <Route path="/tutkintotilaisuudet" component={ExamSessions} />
              <Route
                path="/jarjestajarekisteri"
                component={OrganizerRegistry}
              />
              <Route component={NotFound} />
            </Switch>
          </Layout>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
