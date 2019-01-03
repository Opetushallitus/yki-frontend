import React, { lazy, Suspense } from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import registryReducer from './store/reducers/registry';
import examSessionReducer from './store/reducers/examSession';
import registrationReducer from './store/reducers/registration';
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

const store = createStore(
  rootReducer,
  process.env.NODE_ENV === 'development'
    ? composeWithDevTools(applyMiddleware(thunk))
    : applyMiddleware(thunk),
);

const app = () => (
  <Provider store={store}>
    <Router basename={'/yki'}>
      <Suspense fallback={<Spinner />}>
        <Switch>
          <Route exact path="/" component={Registration} />
          <Route path="/tutkintotilaisuudet" render={() => <ExamSessions />} />
          <ErrorBoundary
            titleKey="errorBoundary.title"
            returnLinkTo="jarjestajarekisteri"
            returnLinkTextKey="errorBoundary.return"
          >
            {/* TODO: change back to use component={Component} after react-router-dom updates version */}
            <Route path="/jarjestajarekisteri" render={() => <Registry />} />
          </ErrorBoundary>
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </Router>
  </Provider>
);

export default app;
