import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import classes from './Filters.module.css';
import { LANGUAGES } from '../../../common/Constants';
import { levelDescription } from '../../../util/util';

const filters = props => {
  const [t, i18n] = useTranslation();

  const languageSelect = (
    <label>
      {t('common.language')}
      <select
        className={classes.Select}
        defaultValue={t(`common.language.${props.language.code}`)}
        onChange={props.onLanguageChange}
        data-cy={'language-filter'}
      >
        {LANGUAGES.map(l => (
          <option key={l.name} value={l.name}>
            {t(`common.language.${l.code}`)}
          </option>
        ))}
      </select>
    </label>
  );

  const levelSelect = (
    <label>
      {t('common.level')}
      <select
        className={classes.Select}
        defaultValue={props.level}
        onChange={props.onLevelChange}
        data-cy={'level-filter'}
      >
        <option value={''}>{t('common.level.all')}</option>
        {props.language.levels.map(l => (
          <option key={l} value={l}>
            {t(levelDescription(l))}
          </option>
        ))}
      </select>
    </label>
  );

  const locationSelect = (
    <label>
      {t('common.exam.location')}
      <select
        className={classes.Select}
        defaultValue={props.location}
        onChange={props.onLocationChange}
        data-cy={'location-filter'}
      >
        <option value={''}>{t('common.location.all')}</option>
        {Object.entries(props.locations).map(l => (
          <option key={l[0]} value={l[0]}>
            {i18n.language === 'sv' ? l[1] : l[0]}
          </option>
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
  locations: PropTypes.object.isRequired,
};

export default filters;
