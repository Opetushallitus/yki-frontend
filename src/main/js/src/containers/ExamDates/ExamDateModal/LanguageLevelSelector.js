import React from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { LANGUAGES } from '../../../common/Constants';
import {languageToString, levelDescription, levelTranslations} from '../../../util/util';
import closeOverlay from "../../../assets/svg/close-overlay.svg";

import classes from './ExamDateView.module.css';

const LanguageLevelSelector = props => {
  const {
    t,
    languageLevels,
    language_code,
    level_code,
    setLanguageCode,
    setLevelCode,
    handleAddLanguageLevel,
    handleRemoveLanguageLevel,
    addDisabled,
    changesEnabled,
  } = props;

  return (
    <>
      {changesEnabled && (
        <>
          <h4 style={{ marginBottom: '0' }}>{t('examDates.choose.languageLevel')}</h4>
          <span />
          <span />
          <div>
            <select
              data-cy="exam-date-languages-select-language"
              className={classes.ExamLevels}
              value={language_code}
              onChange={e => setLanguageCode(e.target.value)}
            >
              {LANGUAGES.map(lang => {
                return (
                  <option key={lang.code} value={lang.code}>
                    {lang.name.toLowerCase()}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <select
              data-cy="exam-date-languages-select-level"
              className={classes.ExamLevels}
              value={level_code}
              onChange={e => setLevelCode(e.target.value)}
            >
              <option value={'PERUS'}>{t(levelTranslations.PERUS).toLowerCase()}</option>
              <option value={'KESKI'}>{t(levelTranslations.KESKI).toLowerCase()}</option>
              <option value={'YLIN'}>{t(levelTranslations.YLIN).toLowerCase()}</option>
            </select>
          </div>
          <div>
            <button
              data-cy="exam-date-languages-add-new"
              type="button"
              className={`${classes.AddLanguageButton} ${addDisabled ? classes.DisabledButton : classes.Active}`}
              onClick={handleAddLanguageLevel}
              disabled={addDisabled}
            >
              {t('common.add')}
            </button>
          </div>
        </>
      )}

      <label className={classes.SelectedLanguages}>{t('examDates.languageLevels')}</label>
      <span />
      <span />

      <div className={classes.AddedLanguages}>
        {languageLevels.map((item, i) => {
          const content = `${languageToString(item.language_code)}, ${levelDescription(item.level_code)}`.toLowerCase();

          return (
            <>
              {changesEnabled ? (
                <span key={i}>
                  <img
                    src={closeOverlay}
                    alt={'delete'}
                    onClick={() => handleRemoveLanguageLevel(i)}
                  />
                  <p>{content}</p>
                </span>
              ) : (
                <p>{content}</p>
              )}
            </>
          );
        })}
      </div>
    </>
  );
};

LanguageLevelSelector.propTypes = {
  languageLevels: PropTypes.arrayOf(
    PropTypes.shape({
      language_code: PropTypes.string,
      level_code: PropTypes.string,
    }),
  ).isRequired,
  language_code: PropTypes.string.isRequired,
  level_code: PropTypes.string.isRequired,
  setLanguageCode: PropTypes.func.isRequired,
  setLevelCode: PropTypes.func.isRequired,
  handleAddLanguageLevel: PropTypes.func.isRequired,
  handleRemoveLanguageLevel: PropTypes.func.isRequired,
  addDisabled: PropTypes.bool.isRequired,
  changesEnabled: PropTypes.bool.isRequired,
};

export default withTranslation()(LanguageLevelSelector);
