import React from 'react';
import { withNamespaces } from 'react-i18next';

import classes from './Filters.module.css';
import { LANGUAGES } from '../../../common/Constants';
import { levelDescription, firstCharToUpper } from '../../../util/util';

const filters = props => {
  const languageSelect = (
    <label>
      {props.t('common.language')}
      <select
        className={classes.Select}
        defaultValue={
          props.language || firstCharToUpper(props.t('common.language.fin'))
        }
        onChange={props.onLanguageChange}
      >
        {LANGUAGES.map(l => (
          <option key={l.name}>{l.name}</option>
        ))}
      </select>
    </label>
  );

  const levels = props.language
    ? LANGUAGES.find(l => l.name === props.language).levels
    : LANGUAGES[0].levels;
  const levelSelect = (
    <label>
      {props.t('common.level')}
      <select
        className={classes.Select}
        defaultValue={levelDescription(props.level)}
        onChange={props.onLevelChange}
      >
        <option>{props.t('common.level.all')}</option>
        {levels.map(l => (
          <option key={l}>{props.t(levelDescription(l))}</option>
        ))}
      </select>
    </label>
  );

  const locationSelect = (
    <label>
      {props.t('common.exam.location')}
      <select
        className={classes.Select}
        defaultValue={props.location}
        onChange={props.onLocationChange}
      >
        {props.locations.map(l => (
          <option key={l}>{l}</option>
        ))}
      </select>
    </label>
  );

  const filters = (
    <div className={classes.Filters}>
      {languageSelect}
      {levelSelect}
      {locationSelect}
    </div>
  );

  return <React.Fragment>{filters}</React.Fragment>;
};

export default withNamespaces()(filters);
