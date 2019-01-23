import React, { lazy, Suspense } from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import registryReducer from './store/reducers/registry';
import examSessionReducer from './store/reducers/examSession';
import registrationReducer from './store/reducers/registration';
import userReducer from './store/reducers/user';
import ErrorBoundary from './containers/ErrorBoundary/ErrorBoundary';
import Spinner from './components/UI/Spinner/Spinner';
import Registration from './containers/Registration/Registration';
import NotFound from './components/NotFound/NotFound';
import PaymentRedirect from './containers/PaymentRedirect/PaymentRedirect';
import PaymentStatus from './components/PaymentStatus/PaymentStatus';
import Init from './containers/Init/Init';

const Registry = lazy(() => import('./containers/Registry/Registry'));
const ExamSessions = lazy(() =>
  import('./containers/ExamSessions/ExamSessions'),
);

const rootReducer = combineReducers({
  registry: registryReducer,
  exam: examSessionReducer,
  reg: registrationReducer,
  user: userReducer,
});

const store = createStore(
  rootReducer,
  process.env.NODE_ENV === 'development'
    ? composeWithDevTools(applyMiddleware(thunk))
    : applyMiddleware(thunk),
);

const app = () => (
  <Provider store={store}>
    <Init>
      <Router basename={'/yki'}>
        <Suspense fallback={<Spinner />}>
          <Switch>
            <Route exact path="/" component={Registration} />
            <Route
              path="/tutkintotilaisuudet"
              render={() => <ExamSessions />}
            />
            <Route path="/maksut/tila" component={PaymentStatus} />
            <Route path="/maksut/:registrationId" component={PaymentRedirect} />
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
    </Init>
  </Provider>
);

export default app;
