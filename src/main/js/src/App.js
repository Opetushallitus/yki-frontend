import React, { Suspense, lazy } from 'react';
import { Provider } from 'react-redux';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import AccessibilityStatement from './components/AccessibilityStatement/AccessibilityStatement';
import LinkExpired from './components/LinkExpired/LinkExpired';
import NotFound from './components/NotFound/NotFound';
import Description from './components/Registration/Description/Description';
import ExamDetailsPage from './components/Registration/ExamDetailsPage/ExamDetailsPage';
import ReEvaluation from './components/Registration/ReEvaluation/ReEvaluation';
import ReEvaluationFormPage from './components/Registration/ReEvaluationForm/ReEvaluationFormPage';
import Spinner from './components/UI/Spinner/Spinner';
import ErrorBoundary from './containers/ErrorBoundary/ErrorBoundary';
import EvaluationPaymentRedirect from './containers/EvaluationPaymentRedirect/EvaluationPaymentRedirect';
import ExamDates from './containers/ExamDates/ExamDates';
import Init from './containers/Init/Init';
import PaymentRedirect from './containers/PaymentRedirect/PaymentRedirect';
import PaymentStatus from './containers/PaymentStatus/PaymentStatus';
import Registration from './containers/Registration/Registration';
import RegistrationPage from './containers/Registration/RegistrationPage/RegistrationPage';
import RegistryExamSessions from './containers/RegistryExamSessions/RegistryExamSessions';
import RegistrationRoute from './hoc/RegistrationRoute/RegistrationRoute';
import ScrollToTop from './ScrollToTop';
import examDatesReducer from './store/reducers/examDates';
import examSessionReducer from './store/reducers/examSession';
import registrationReducer from './store/reducers/registration';
import registryReducer from './store/reducers/registry';
import organizationSessionsReducer from './store/reducers/registryExamSession';
import userReducer from './store/reducers/user';
import ykiReducer from './store/reducers/ykiReducer';
import * as i18nKeys from "./common/LocalizationKeys";

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
          <ScrollToTop />
          <Switch>
            <ErrorBoundary>
              <RegistrationRoute exact path="/" component={Description} />
              <RegistrationRoute
                exact
                path="/ilmoittautuminen"
                component={Description}
              />
              <RegistrationRoute
                exact
                path="/tarkistusarviointi"
                component={ReEvaluation}
              />
              <RegistrationRoute
                exact
                path="/tarkistusarviointi/:id"
                component={ReEvaluationFormPage}
              />
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
              <RegistrationRoute
                path="/maksu/vanhentunut"
                component={LinkExpired}
              />
              <Route
                path="/maksu/tila"
                render={props => (
                  <PaymentStatus
                    {...props}
                    infoUrl={'/yki/api/exam-session/'}
                    returnUrl="/"
                  />
                )}
              />
              <RegistrationRoute
                path="/maksu/ilmoittautuminen/:registrationId"
                component={PaymentRedirect}
              />
              <RegistrationRoute
                path="/tutkintotilaisuudet"
                component={() => <ExamSessions />}
              />
              <Route exact path="/jarjestajarekisteri" component={Registry} />
              <Route
                path="/jarjestajarekisteri/:oid/tutkintotilaisuudet"
                component={RegistryExamSessions}
              />

              <Route path="/tutkintopaivat" component={ExamDates} />
              <Route
                path="/saavutettavuus"
                component={AccessibilityStatement}
              />
              <Route
                path="/tarkistusarviointi/maksu/tila"
                render={props => (
                  <PaymentStatus
                    {...props}
                    failMessage={i18nKeys.payment_status_error_evaluation}
                    cancelMessage={i18nKeys.payment_status_error_evaluation}
                    infoUrl={'/yki/api/evaluation/order/'}
                    returnUrl="/tarkistusarviointi"
                  />
                )}
              />
              <Route
                path="/tarkistusarviointi/tilaus/:evaluationOrderId"
                component={EvaluationPaymentRedirect}
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
