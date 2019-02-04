import React from 'react';
import { withNamespaces } from 'react-i18next';
import PropTypes from 'prop-types';

import classes from './Filters.module.css';
import { LANGUAGES } from '../../../common/Constants';
import { levelDescription } from '../../../util/util';

const filters = props => {
  const languageSelect = (
    <label>
      {props.t('common.language')}
      <select
        className={classes.Select}
        defaultValue={props.language.name}
        onChange={props.onLanguageChange}
        data-cy={'language-filter'}
      >
        {LANGUAGES.map(l => (
          <option key={l.name}>{l.name}</option>
        ))}
      </select>
    </label>
  );

  const levelSelect = (
    <label>
      {props.t('common.level')}
      <select
        className={classes.Select}
        defaultValue={props.level}
        onChange={props.onLevelChange}
        data-cy={'level-filter'}
      >
        <option value={''}>{props.t('common.level.all')}</option>
        {props.language.levels.map(l => (
          <option key={l} value={l}>
            {props.t(levelDescription(l))}
          </option>
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
        data-cy={'location-filter'}
      >
        <option value={''}>{props.t('common.location.all')}</option>
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

filters.propTypes = {
  language: PropTypes.object.isRequired,
  onLanguageChange: PropTypes.func.isRequired,
  level: PropTypes.string.isRequired,
  onLevelChange: PropTypes.func.isRequired,
  location: PropTypes.string.isRequired,
  onLocationChange: PropTypes.func.isRequired,
  locations: PropTypes.array.isRequired,
};

export default withNamespaces()(filters);
