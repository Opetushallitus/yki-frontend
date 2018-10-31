import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import ophStyles from './assets/css/oph-styles.css';
import organizerReducer from './store/reducers/organizer';
import examSessionReducer from './store/reducers/examSession';
import registrationReducer from './store/reducers/registration';
import Layout from './hoc/Layout/Layout';
import OrganizerRegistry from './containers/OrganizerRegistry/OrganizerRegistry';
import ExamSessions from './containers/ExamSessions/ExamSessions';
import AddOrganizer from './containers/Organizers/AddOrganizer/AddOrganizer';
import NotFound from './components/NotFound/NotFound';

class App extends Component {
  render() {
    const rootReducer = combineReducers({
      org: organizerReducer,
      exam: examSessionReducer,
      reg: registrationReducer,
    });

    // To enable https://github.com/zalmoxisus/redux-devtools-extension
    const composeEnhancers =
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    const store = createStore(
      rootReducer,
      composeEnhancers(applyMiddleware(thunk)),
    );

    return (
      <Provider store={store}>
        <BrowserRouter basename="/yki">
          <div className={ophStyles['oph-typography']}>
            <Layout>
              <Switch>
                <Route exact path="/" component={OrganizerRegistry} />
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
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
