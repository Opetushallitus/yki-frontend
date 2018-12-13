import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import registryReducer from './store/reducers/registry';
import examSessionReducer from './store/reducers/examSession';
import registrationReducer from './store/reducers/registration';
import Layout from './hoc/Layout/Layout';
import ErrorBoundary from './containers/ErrorBoundary/ErrorBoundary';
import Spinner from './components/UI/Spinner/Spinner';
import Registration from './containers/Registration/Registration';
import NotFound from './components/NotFound/NotFound';

const Registry = lazy(() => import('./containers/Registry/Registry'));
const ExamSessions = lazy(() =>
  import('./containers/ExamSessions/ExamSessions'),
);

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

const app = () => (
  <Provider store={store}>
    <Router basename={'/yki'}>
      <Suspense fallback={<Spinner />}>
        <Layout>
          <Switch>
            <Route exact path="/" component={Registration} />
            <ErrorBoundary
              title="Tapahtui odottamaton virhe"
              returnLinkTo="jarjestajarekisteri"
              returnLinkText="Palaa etusivulle"
            >
              {/* TODO: change back to use component={Component} after react-router-dom updates version */}
              <Route path="/jarjestajarekisteri" render={() => <Registry />} />
            </ErrorBoundary>
            <Route
              path="/tutkintotilaisuudet"
              render={() => <ExamSessions />}
            />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Suspense>
    </Router>
  </Provider>
);

export default app;
