import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';

import { LANGUAGES } from '../../common/Constants';
import Checkbox from '../UI/Checkbox/Checkbox';
import classes from './LanguageCheckboxes.module.css';

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

  const levelLocalisationKeys = [
    'common.level.basic',
    'common.level.middle',
    'common.level.high'
  ];

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

  const checkboxGrid = LANGUAGES.map(l => (
    <div key={l.name} className={classes.CheckboxGrid}>
      <div className={classes.Language}>{l.name}</div>
      {l.levels.map(ll => (
        <Checkbox
          key={ll}
          name={ll}
          checkboxId={`${l.code}-${ll}`}
          checkBoxClass={classes.Checkbox}
          languageCode={l.code}
          languageLevel={ll}
          checked={isSelected(l.code, ll)}
          onChange={() => {
            toggleChecked(l.code, ll);
          }}
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

export default withTranslation()(languageCheckboxes);
