import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import ophStyles from './assets/css/oph-styles.css';
import Layout from './hoc/Layout/Layout';
import OrganizerRegistry from './containers/OrganizerRegistry/OrganizerRegistry';
import ExamSessions from './containers/ExamSessions/ExamSessions';
import AddOrganizer from './containers/Organizers/AddOrganizer/AddOrganizer';
import NotFound from './components/NotFound/NotFound';

class App extends Component {
  render() {
    return (
      <div className={ophStyles['oph-typography']}>
        <Layout>
          <Switch>
            <Route exact path="/" component={OrganizerRegistry} />
            <Route
              exact
              path="/jarjestajarekisteri"
              component={OrganizerRegistry}
            />
            <Route path="/jarjestajarekisteri/uusi" component={AddOrganizer} />
            <Route path="/tutkintotilaisuudet" component={ExamSessions} />
            <Route path="/jarjestajarekisteri" component={OrganizerRegistry} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </div>
    );
  }
}

export default App;
