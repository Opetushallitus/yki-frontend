import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import classes from './LocationSelection.module.css';
import Header from '../../../components/Header/Header';
import BackButton from '../../../components/Registration/BackButton/BackButton';
import { levelDescription } from '../../../util/util';
import * as actions from '../../../store/actions/index';

const locationSelection = props => {
  if (!props.language) {
    return <Redirect to={props.t('registration.path.select.language')} />;
  }
  if (!props.level) {
    return <Redirect to={props.t('registration.path.select.level')} />;
  }

  document.title = props.t('registration.document.title.location');

  const selectLocation = location => {
    props.onSelectLocation(location);
    props.history.push(props.t('registration.path.select.exam'));
  };

  return (
    <React.Fragment>
      <Header />
      <BackButton clicked={() => props.history.goBack()} />
      <main className={classes.Content}>
        <p className={classes.Title}>{props.t('registration.title')}</p>
        <p className={classes.LanguageSelection}>
          {props.t('registration.selected.language')}:{' '}
          <strong>{props.language}</strong>
          <br />
          {props.t('registration.selected.level')}:{' '}
          <strong>{levelDescription(props.level)}</strong>
        </p>
        <p>{props.t('registration.select.location')}:</p>
        <div className={classes.Selections}>
          {props.locations.map(location => (
            <span
              key={location}
              className={classes.Selection}
              onClick={() => selectLocation(location)}
            >
              {location}
            </span>
          ))}
        </div>
      </main>
    </React.Fragment>
  );
};

const mapStateToProps = state => {
  return {
    language: state.registration.language,
    level: state.registration.level,
    locations: state.registration.locations,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSelectLocation: location => dispatch(actions.selectLocation(location)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withNamespaces()(locationSelection));
