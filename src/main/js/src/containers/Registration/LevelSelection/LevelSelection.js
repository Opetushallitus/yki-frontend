import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import classes from './LevelSelection.module.css';
import Header from '../../../components/Header/Header';
import BackButton from '../../../components/Registration/BackButton/BackButton';
import { levelDescription } from '../../../util/util';
import * as actions from '../../../store/actions/index';

const languageSelection = props => {
  const [t] = useTranslation();

  if (!props.language) {
    return <Redirect to={t('registration.path.select.language')} />;
  }
  document.title = t('registration.document.title.level');

  const selectLevel = level => {
    props.onSelectLevel(level);
    props.history.push(t('registration.path.select.location'));
  };

  return (
    <React.Fragment>
      <Header />
      <BackButton
        clicked={() =>
          props.history.push(t('registration.path.select.language'))
        }
      />
      <main className={classes.Content}>
        <p className={classes.Title}>{t('registration.title')}</p>
        <p className={classes.LanguageSelection}>
          {t('registration.selected.language')}:{' '}
          <strong>{t(`common.language.${props.language.code}`)}</strong>
        </p>
        <p>{t('registration.select.level')}:</p>
        <div className={classes.Selections}>
          {props.language.levels.map(level => (
            <span
              key={level}
              onClick={() => selectLevel(level)}
              className={classes.Selection}
            >
              <p className={classes.SelectionText}>
                {t(levelDescription(level))}
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
)(languageSelection);
