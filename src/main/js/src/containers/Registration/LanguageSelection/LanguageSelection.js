import React from 'react';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';

import classes from './LanguageSelection.module.css';
import Header from '../../../components/Header/Header';
import BackButton from '../../../components/Registration/BackButton/BackButton';
import { LANGUAGES } from '../../../common/Constants';
import * as actions from '../../../store/actions/index';

const languageSelection = props => {
  document.title = props.t('registration.document.title.language');

  const selectLanguage = language => {
    props.onSelectLanguage(language);
    props.onFetchExamLocations();
    props.history.push(props.t('registration.path.select.level'));
  };

  return (
    <React.Fragment>
      <Header />
      <BackButton clicked={() => props.history.goBack()} />
      <main className={classes.Content}>
        <p className={classes.Title}>{props.t('registration.title')}</p>
        <p className={classes.Instructions}>
          {props.t('registration.select.language')}:
        </p>
        <div className={classes.Selections}>
          {LANGUAGES.map(l => (
            <span
              key={l.name}
              onClick={() => selectLanguage(l.name)}
              className={classes.Selection}
            >
              <p className={classes.SelectionText}>{l.name}</p>
            </span>
          ))}
        </div>
      </main>
    </React.Fragment>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchExamLocations: () => dispatch(actions.fetchExamLocations()),
    onSelectLanguage: language => dispatch(actions.selectLanguage(language)),
  };
};

export default connect(
  null,
  mapDispatchToProps,
)(withNamespaces()(languageSelection));
