import React, { Suspense, lazy } from 'react';
import { Provider } from 'react-redux';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import AccessibilityStatement from './components/AccessibilityStatement/AccessibilityStatement';
import NotFound from './components/NotFound/NotFound';
import Spinner from './components/UI/Spinner/Spinner';
import ErrorBoundary from './containers/ErrorBoundary/ErrorBoundary';
import ExamDates from './containers/ExamDates/ExamDates';
import Init from './containers/Init/Init';
import QuarantineMatches from './containers/Quarantine/QuarantineMatches';
import QuarantineHistory from './containers/Quarantine/QuarantineHistory';
import Quarantine from './containers/Quarantine/Quarantine';
import PaymentsReport from './containers/PaymentsReport/PaymentsReport';
import RegistryExamSessions from './containers/RegistryExamSessions/RegistryExamSessions';
import ScrollToTop from './ScrollToTop';
import examDatesReducer from './store/reducers/examDates';
import examSessionReducer from './store/reducers/examSession';
import registryReducer from './store/reducers/registry';
import organizationSessionsReducer from './store/reducers/registryExamSession';
import userReducer from './store/reducers/user';
import ykiReducer from './store/reducers/ykiReducer';
import paymentsReportReducer from './store/reducers/paymentsReport';
import quarantineReducer from './store/reducers/quarantine';

const Registry = lazy(() => import('./containers/Registry/Registry'));
const ExamSessions = lazy(() =>
  import('./containers/ExamSessions/ExamSessions'),
);

const rootReducer = combineReducers({
  registry: registryReducer,
  registryDetails: organizationSessionsReducer,
  exam: examSessionReducer,
  user: userReducer,
  dates: examDatesReducer,
  yki: ykiReducer,
  paymentsReport: paymentsReportReducer,
  quarantine: quarantineReducer,
});

const store = createStore(
  rootReducer,
  process.env.NODE_ENV === 'development'
    ? composeWithDevTools(applyMiddleware(thunk))
    : applyMiddleware(thunk),
);

const app = () => (
  <Provider store={store}>
    <Suspense fallback={<Spinner />}>
      <Init>
        <Router basename={'/yki'}>
          <ScrollToTop />
          <Switch>
            <ErrorBoundary>
              <Route
                path="/tutkintotilaisuudet"
                component={() => <ExamSessions />}
              />
              <Route exact path="/jarjestajarekisteri" component={Registry} />
              <Route
                path="/jarjestajarekisteri/:oid/tutkintotilaisuudet"
                component={RegistryExamSessions}
              />

              <Route path="/tutkintopaivat" component={ExamDates} />
              <Route exact path="/maksuraportit" component={PaymentsReport} />
              <Route exact path="/osallistumiskiellot/odottavat" component={QuarantineMatches} />
              <Route exact path="/osallistumiskiellot/aiemmat" component={QuarantineHistory} />
              <Route exact path="/osallistumiskiellot/voimassa" component={Quarantine} />
              <Route
                path="/saavutettavuus"
                component={AccessibilityStatement}
              />
            </ErrorBoundary>
            <Route component={NotFound} />
          </Switch>
        </Router>
      </Init>
    </Suspense>
  </Provider>
);

export default app;
