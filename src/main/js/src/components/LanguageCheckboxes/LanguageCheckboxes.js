import React, { PureComponent } from 'react';

import classes from './LanguageCheckboxes.module.css';
import { LANGUAGES } from '../../common/Constants';
import Checkbox from '../UI/Checkbox/Checkbox';

class LanguageCheckboxes extends PureComponent {
  state = {
    languages: [],
  };

  toggleChecked(language) {
    const languages = [...this.state.languages];
    let updatedLanguages = [];
    if (
      languages.some(
        l =>
          l.language_code === language.language_code &&
          l.level_code === language.level_code,
      )
    ) {
      updatedLanguages = languages.filter(
        l =>
          l.language_code !== language.code &&
          l.level_code !== language.level_code,
      );
    } else {
      updatedLanguages = [...languages, language];
    }
    this.setState({ languages: updatedLanguages });
    this.props.onUpdate(updatedLanguages);
  }

  render() {
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
            clicked={() =>
              this.toggleChecked({ language_code: l.code, level_code: ll })
            }
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
  }
}

export default LanguageCheckboxes;
