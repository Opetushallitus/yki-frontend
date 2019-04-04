import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import classes from './LocationSelection.module.css';
import Header from '../../../components/Header/Header';
import BackButton from '../../../components/Registration/BackButton/BackButton';
import { levelDescription } from '../../../util/util';
import * as actions from '../../../store/actions/index';

const locationSelection = props => {
  const [t, i18n] = useTranslation();

  if (!props.language || !props.level) {
    return <Redirect to={t('registration.path.select.language')} />;
  }

  document.title = t('registration.document.title.location');

  const selectLocation = location => {
    props.onSelectLocation(location);
    props.history.push({
      pathname: t('registration.path.select.exam'),
      search: `?language=${props.language.code}&level=${
        props.level
      }&location=${location}&lang=${i18n.language}`,
    });
  };

  return (
    <React.Fragment>
      <Header />
      <BackButton
        clicked={() => props.history.push(t('registration.path.select.level'))}
      />
      <main className={classes.Content}>
        <h1>{t('registration.title')}</h1>
        <p className={classes.LanguageSelection}>
          {t('registration.selected.language')}:{' '}
          <strong>{t(`common.language.${props.language.code}`)}</strong>
          <br />
          {t('registration.selected.level')}:{' '}
          <strong>{levelDescription(props.level)}</strong>
        </p>
        <p>{t('registration.select.location')}:</p>
        <div className={classes.Selections}>
          <button onClick={() => selectLocation('')} role="link">
            {t('common.location.all')}
          </button>
          {props.locations.map(l => (
            <button key={l.fi} onClick={() => selectLocation(l.fi)} role="link">
              {i18n.language === 'sv' ? l.sv : l.fi}
            </button>
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
)(locationSelection);
