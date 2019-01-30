import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import classes from './Registration.module.css';
import Header from '../../components/Header/Header';
import BackButton from '../../components/Registration/BackButton/BackButton';
import Filters from '../../components/Registration/Filters/Filters';
import * as actions from '../../store/actions/index';

class Registration extends Component {
  componentDidMount() {
    if (!this.props.language || !this.props.level || !this.props.location) {
      this.props.onSetDefaultFilters();
      this.props.onFetchExamSessions();
    }
  }

  onLanguageChange = event => {
    this.props.onSelectLanguage(event.target.value);
  };

  onLevelChange = event => {
    this.props.onSelectLevel(event.target.value);
  };

  onLocationChange = event => {
    this.props.onSelectLocation(event.target.value);
  };

  render() {
    return (
      <React.Fragment>
        <Header />
        <BackButton clicked={() => this.props.history.goBack()} />
        <main className={classes.Content}>
          <p className={classes.Title}>{this.props.t('registration.title')}</p>
          <Filters
            language={this.props.language}
            onLanguageChange={this.onLanguageChange}
            level={this.props.level}
            onLevelChange={this.onLevelChange}
            location={this.props.location}
            onLocationChange={this.onLocationChange}
            locations={this.props.locations}
          />
          <p className={classes.Upcoming}>
            {this.props.t('examSession.upcomingExamSessions')}
          </p>
          {/* TODO: list of exam sessions */}
        </main>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    examSessions: state.registration.examSessions,
    language: state.registration.language,
    level: state.registration.level,
    location: state.registration.location,
    locations: state.registration.locations,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchExamSessions: () => dispatch(actions.fetchExamSessions()),
    onSelectLevel: level => dispatch(actions.selectLevel(level)),
    onSelectLanguage: language => dispatch(actions.selectLanguage(language)),
    onSelectLocation: location => dispatch(actions.selectLocation(location)),
    onSetDefaultFilters: () => dispatch(actions.setDefaultFilters()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withNamespaces()(Registration));
