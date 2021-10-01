import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';

import { LANGUAGES } from '../../common/Constants';
import Checkbox from '../UI/Checkbox/Checkbox';
import classes from './LanguageCheckboxes.module.css';
import { langLocalisationKey } from '../../util/localisationUtil'
import { levelTranslations } from '../../util/util';

const languageCheckboxes = props => {
  const toggleChecked = (code, level) => {
    let updatedLanguages = props.languages.some(
      l => l.language_code === code && l.level_code === level,
    )
      ? props.languages.filter(
          l => l.language_code !== code || l.level_code !== level,
        )
      : [...props.languages, { language_code: code, level_code: level }];

    props.onChange(updatedLanguages);
  };

  const isSelected = (languageCode, levelCode) =>
    props.languages.some(
      l => l.language_code === languageCode && l.level_code === levelCode,
    );

  const levelLocalisationKeys = Object.values(levelTranslations);

  const languageLabels = (
    <div className={classes.LanguageLabels}>
      <span className={classes.LanguageLabel} />
      {levelLocalisationKeys.map(key => (
        <span key={key} className={classes.LanguageLabel}>
          {props.t(key)}
        </span>
      ))}
    </div>
  );

  const checkboxGrid = LANGUAGES.map(lang => {
    const localisationKey = langLocalisationKey(lang);

    return (
      <div key={localisationKey} className={classes.CheckboxGrid}>
        <div className={classes.Language}>{props.t(localisationKey)}</div>

        {lang.levels.map(level => (
          <Checkbox
            key={level}
            name={level}
            checkboxId={`${lang.code}-${level}`}
            checkBoxClass={classes.Checkbox}
            languageCode={lang.code}
            languageLevel={level}
            checked={isSelected(lang.code, level)}
            onChange={() => {
              toggleChecked(lang.code, level);
            }}
          />
        ))}
      </div>
    )
  });

  return (
    <div className={classes.LanguageCheckboxes}>
      {languageLabels}
      {checkboxGrid}
    </div>
  );
};

languageCheckboxes.propTypes = {
  languages: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default withTranslation()(languageCheckboxes);
