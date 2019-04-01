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
      search: `?language=${props.language.code}&level=${props.level}&location=${location}&lang=${i18n.language}`
    });
  };

  return (
    <React.Fragment>
      <Header />
      <BackButton
        clicked={() => props.history.push(t('registration.path.select.level'))}
      />
      <main className={classes.Content}>
        <p className={classes.Title}>{t('registration.title')}</p>
        <p className={classes.LanguageSelection}>
          {t('registration.selected.language')}:{' '}
          <strong>{t(`common.language.${props.language.code}`)}</strong>
          <br />
          {t('registration.selected.level')}:{' '}
          <strong>{levelDescription(props.level)}</strong>
        </p>
        <p>{t('registration.select.location')}:</p>
        <div className={classes.Selections}>
          <span
            className={classes.Selection}
            onClick={() => selectLocation('')}
          >
            {t('common.location.all')}
          </span>
          {props.locations.map(l => (
            <span
              key={l.fi}
              className={classes.Selection}
              onClick={() => selectLocation(l.fi)}
            >
              {i18n.language === 'sv' ? l.sv : l.fi}
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
)(locationSelection);
