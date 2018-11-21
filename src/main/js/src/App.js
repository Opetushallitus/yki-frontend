import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import registryReducer from './store/reducers/registry';
import examSessionReducer from './store/reducers/examSession';
import registrationReducer from './store/reducers/registration';
import Layout from './hoc/Layout/Layout';
import Registry from './containers/Registry/Registry';
import ExamSessions from './containers/ExamSessions/ExamSessions';
import NewRegistryItem from './containers/Registry/RegistryItem/NewRegistryItem/NewRegistryItem';
import NotFound from './components/NotFound/NotFound';

class App extends Component {
  render() {
    const rootReducer = combineReducers({
      registry: registryReducer,
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
              <Route exact path="/jarjestajarekisteri" component={Registry} />
              <Route
                path="/jarjestajarekisteri/uusi"
                component={NewRegistryItem}
              />
              <Route path="/tutkintotilaisuudet" component={ExamSessions} />
              <Route path="/jarjestajarekisteri" component={Registry} />
              <Route component={NotFound} />
            </Switch>
          </Layout>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
