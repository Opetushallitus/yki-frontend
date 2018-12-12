import React from 'react';
import PropTypes from 'prop-types';

import classes from './LanguageCheckboxes.module.css';
import { LANGUAGES } from '../../common/Constants';
import Checkbox from '../UI/Checkbox/Checkbox';

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

  const levels = ['Perustaso', 'Keskitaso', 'Ylin taso'];
  const languageLabels = (
    <div className={classes.LanguageLabels}>
      <span className={classes.LanguageLabel} />
      {levels.map(level => (
        <span key={level} className={classes.LanguageLabel}>
          {level}
        </span>
      ))}
    </div>
  );

  const checkboxGrid = LANGUAGES.map(l => (
    <div key={l.name} className={classes.CheckboxGrid}>
      <div className={classes.Language}>{l.name}</div>
      {l.levels.map(ll => (
        <Checkbox
          key={ll}
          className={classes.Checkbox}
          languageCode={l.code}
          languageLevel={ll}
          checked={isSelected(l.code, ll)}
          onChange={(code, level) => toggleChecked(code, level)}
        />
      ))}
    </div>
  ));

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

export default languageCheckboxes;
