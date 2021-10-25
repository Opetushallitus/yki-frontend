import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { LANGUAGES } from '../../../common/Constants';
import { levelDescription } from '../../../util/util';
import Checkbox from '../../UI/Checkbox/Checkbox';
import classes from './Filters.module.css';
import * as R from 'ramda';

const filters = props => {
  const [t, i18n] = useTranslation();

  const mounted = useRef(false);
  /*
   * To be able to handle page refresh, filter values need to
   * be added to query params when component updates.
   */
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    } else {
      const search = `?language=${props.language.code}&level=${props.level}&location=${props.location}&lang=${i18n.language}`;
      if (props.history.location.search !== search) {
        props.history.replace({
          pathname: props.history.location.pathname,
          search: search,
        });
      }
    }
  });

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

  const sortLocationsBySelectedLang = (locations) => {
    const lang = i18n.language === 'sv' ? 'sv' : 'fi';
    return R.sortBy(R.prop(lang))(locations);
  };

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
        {sortLocationsBySelectedLang(props.locations).map(location => (
          <option key={`${location.fi}-${location.sv}`} value={location.fi}>
            {i18n.language === 'sv' ? location.sv : location.fi}
          </option>
        ))}
      </select>
    </label>
  );

  const availabilityCheckbox = (
    <div className={classes.CheckBox}>
      <Checkbox
        datacy={'exam-availability-checkbox'}
        onChange={props.onAvailabilityFilterChange}
        ariaLabel={t('common.exam.availableExams')}
        label={t('common.exam.availableExams')}
        checkboxId={'available'}
      />
    </div>
  );

  const openRegistrationCheckbox = (
    <div className={classes.CheckBox}>
      <Checkbox
        onChange={props.onRegistrationFilterChange}
        ariaLabel={t('common.exam.openExams')}
        label={t('common.exam.openExams')}
        checkboxId="open-exams"
      />
    </div>
  );

  const filters = (
    <>
      <div className={classes.Filters}>
        {languageSelect}
        {levelSelect}
        {locationSelect}
      </div>
      <div className={classes.FilterCheckboxes}>
        {availabilityCheckbox}
        {openRegistrationCheckbox}
      </div>
    </>
  );

  return <>{filters}</>;
};

filters.propTypes = {
  language: PropTypes.object.isRequired,
  onLanguageChange: PropTypes.func.isRequired,
  level: PropTypes.string.isRequired,
  onLevelChange: PropTypes.func.isRequired,
  location: PropTypes.string.isRequired,
  onLocationChange: PropTypes.func.isRequired,
  locations: PropTypes.array.isRequired,
  onAvailabilityFilterChange: PropTypes.func.isRequired,
  onRegistrationFilterChange: PropTypes.func.isRequired,
};

export default filters;
