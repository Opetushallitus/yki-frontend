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
import examDatesReducer from './store/reducers/examDates';
import organizationSessionsReducer from './store/reducers/registryExamSession';
import AccessibilityStatement from './components/AccessibilityStatement/AccessibilityStatement';
import ErrorBoundary from './containers/ErrorBoundary/ErrorBoundary';
import Spinner from './components/UI/Spinner/Spinner';
import Description from './components/Registration/Description/Description';
import LinkExpired from './components/LinkExpired/LinkExpired';
import Registration from './containers/Registration/Registration';
import NotFound from './components/NotFound/NotFound';
import PaymentRedirect from './containers/PaymentRedirect/PaymentRedirect';
import PaymentStatus from './containers/PaymentStatus/PaymentStatus';
import Init from './containers/Init/Init';
import ExamDates from './containers/ExamDates/ExamDates';
import RegistrationPage from './containers/Registration/RegistrationPage/RegistrationPage';
import ExamDetailsPage from './components/Registration/ExamDetailsPage/ExamDetailsPage';
import RegistryExamSessions from './containers/RegistryExamSessions/RegistryExamSessions';

import RegistrationRoute from "./hoc/RegistrationRoute/RegistrationRoute";
import ykiReducer from './store/reducers/ykiReducer';

const Registry = lazy(() => import('./containers/Registry/Registry'));
const ExamSessions = lazy(() =>
  import('./containers/ExamSessions/ExamSessions'),
);

const rootReducer = combineReducers({
  registry: registryReducer,
  registryDetails: organizationSessionsReducer,
  exam: examSessionReducer,
  registration: registrationReducer,
  user: userReducer,
  dates: examDatesReducer,
  yki: ykiReducer,
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
          <Switch>
            <ErrorBoundary>
              <RegistrationRoute exact path="/" component={Description} />
              <RegistrationRoute exact path="/ilmoittautuminen" component={Description} />
              <RegistrationRoute
                path="/ilmoittautuminen/valitse-tutkintotilaisuus"
                component={Registration}
              />
              <RegistrationRoute
                path="/tutkintotilaisuus/:examSessionId"
                component={ExamDetailsPage}
              />
              <RegistrationRoute
                path="/ilmoittautuminen/tutkintotilaisuus/:examSessionId"
                component={RegistrationPage}
              />
              <RegistrationRoute
                path="/ilmoittautuminen/vanhentunut"
                component={LinkExpired}
              />
              <RegistrationRoute path="/maksu/vanhentunut" component={LinkExpired} />
              <RegistrationRoute path="/maksu/tila" component={PaymentStatus} />
              <RegistrationRoute
                path="/maksu/ilmoittautuminen/:registrationId"
                component={PaymentRedirect}
              />
              <Route
                path="/tutkintotilaisuudet"
                render={() => <ExamSessions />}
              />
              <Route exact path="/jarjestajarekisteri" component={Registry} />
              <Route path="/jarjestajarekisteri/:oid/tutkintotilaisuudet" component={RegistryExamSessions} />

              <Route path="/tutkintopaivat" component={ExamDates} />
              <Route path="/saavutettavuus" component={AccessibilityStatement} />
            </ErrorBoundary>
            <Route component={NotFound} />
          </Switch>
        </Router>
      </Init>
    </Suspense>
  </Provider>
);

export default app;
