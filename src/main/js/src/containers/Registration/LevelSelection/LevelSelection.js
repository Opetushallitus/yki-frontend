import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import classes from './LevelSelection.module.css';
import Header from '../../../components/Header/Header';
import BackButton from '../../../components/Registration/BackButton/BackButton';
import { levelDescription } from '../../../util/util';
import * as actions from '../../../store/actions/index';

const languageSelection = props => {
  if (!props.language) {
    return <Redirect to={props.t('registration.path.select.language')} />;
  }
  document.title = props.t('registration.document.title.level');

  const selectLevel = level => {
    props.onSelectLevel(level);
    props.history.push(props.t('registration.path.select.location'));
  };

  return (
    <React.Fragment>
      <Header />
      <BackButton
        clicked={() =>
          props.history.push(props.t('registration.path.select.language'))
        }
      />
      <main className={classes.Content}>
        <p className={classes.Title}>{props.t('registration.title')}</p>
        <p className={classes.LanguageSelection}>
          {props.t('registration.selected.language')}:{' '}
          <strong>{props.language.name}</strong>
        </p>
        <p>{props.t('registration.select.level')}:</p>
        <div className={classes.Selections}>
          {props.language.levels.map(level => (
            <span
              key={level}
              onClick={() => selectLevel(level)}
              className={classes.Selection}
            >
              <p className={classes.SelectionText}>
                {props.t(levelDescription(level))}
              </p>
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
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSelectLevel: level => dispatch(actions.selectLevel(level)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(languageSelection));
