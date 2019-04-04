import React from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import classes from './LanguageSelection.module.css';
import Header from '../../../components/Header/Header';
import BackButton from '../../../components/Registration/BackButton/BackButton';
import { LANGUAGES } from '../../../common/Constants';
import * as actions from '../../../store/actions/index';

const languageSelection = props => {
  const [t] = useTranslation();

  document.title = t('registration.document.title.language');

  const selectLanguage = language => {
    props.onFetchExamSessions();
    props.onSelectLanguage(language);
    props.history.push(t('registration.path.select.level'));
  };

  return (
    <React.Fragment>
      <Header />
      <BackButton clicked={() => props.history.push('/')} />
      <main className={classes.Content}>
        <h1>{t('registration.title')}</h1>
        <p className={classes.Instructions}>
          {t('registration.select.language')}:
        </p>
        <div className={classes.Selections}>
          {LANGUAGES.map(l => (
            <button
              key={l.name}
              onClick={() => selectLanguage(l)}
              className={classes.Selection}
              role="link"
            >
              {t(`common.language.${l.code}`)}
            </button>
          ))}
        </div>
      </main>
    </React.Fragment>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchExamSessions: () => dispatch(actions.fetchExamSessions()),
    onSelectLanguage: language => dispatch(actions.selectLanguage(language)),
  };
};

export default connect(
  null,
  mapDispatchToProps,
)(languageSelection);
