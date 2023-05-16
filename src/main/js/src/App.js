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
import ReEvaluationSuccessContent from "./components/Registration/ReEvaluationSuccess/ReEvaluationSuccessContent";
import ReEvaluationSuccessHeadline from "./components/Registration/ReEvaluationSuccess/ReEvaluationSuccessHeadline";
import RegistrationPaidContent from './components/Registration/RegistrationPaid/RegistrationPaidContent';
import RegistrationPaidHeadline from "./components/Registration/RegistrationPaid/RegistrationPaidHeadline";
import Spinner from './components/UI/Spinner/Spinner';
import ErrorBoundary from './containers/ErrorBoundary/ErrorBoundary';
import NewEvaluationPaymentRedirect from './containers/NewEvaluationPaymentRedirect/NewEvaluationPaymentRedirect';
import ExamDates from './containers/ExamDates/ExamDates';
import Init from './containers/Init/Init';
import QuarantineMatches from './containers/Quarantine/QuarantineMatches';
import QuarantineHistory from './containers/Quarantine/QuarantineHistory';
import Quarantine from './containers/Quarantine/Quarantine';
import NewPaymentRedirect from './containers/NewPaymentRedirect/NewPaymentRedirect';
import PaymentsReport from './containers/PaymentsReport/PaymentsReport';
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
  registration: registrationReducer,
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
                    renderSuccessHeadline={examSession => (
                      <RegistrationPaidHeadline
                        examSession={examSession}
                        t={props.t}
                      />
                    )}
                    successContent={<RegistrationPaidContent t={props.t} />}
                    cancelMessage={'payment.status.cancel.info1'}
                    failMessage={'payment.status.error.info1'}
                    returnUrl={'/yki'}
                    fetchExamSession={true}
                  />
                )}
              />
              <RegistrationRoute
                path="/maksu/v2/ilmoittautuminen/:registrationId"
                component={NewPaymentRedirect}
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
              <Route exact path="/maksuraportit" component={PaymentsReport} />
              <Route exact path="/osallistumiskiellot/odottavat" component={QuarantineMatches} />
              <Route exact path="/osallistumiskiellot/aiemmat" component={QuarantineHistory} />
              <Route exact path="/osallistumiskiellot/voimassa" component={Quarantine} />
              <Route
                path="/saavutettavuus"
                component={AccessibilityStatement}
              />
              <Route
                path="/tarkistusarviointi/maksu/tila"
                render={props => (
                  <PaymentStatus
                    {...props}
                    renderSuccessHeadline={examSession => (
                      <ReEvaluationSuccessHeadline t={props.t} />
                    )}
                    successContent={<ReEvaluationSuccessContent t={props.t} />}
                    cancelMessage={'payment.status.error.evaluation'}
                    failMessage={'payment.status.error.evaluation'}
                    returnUrl={'/yki/tarkistusarviointi'}
                  />
                )}
              />
              <Route
                path="/tarkistusarviointi/v2/tilaus/:evaluationOrderId"
                component={NewEvaluationPaymentRedirect}
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
