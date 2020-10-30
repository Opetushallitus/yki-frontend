import React, {useState} from 'react';
import {withTranslation} from 'react-i18next';
import DatePicker from '../../../components/UI/DatePicker/DatePicker';

import classes from './AddOrEditExamDate.module.css';
import ExamRegistrationDatesSelector from "../RegistrationPeriodSelector/RegistrationPeriodSelector";
import {levelTranslations} from "../../../util/util";
import {LANGUAGES} from "../../../common/Constants";

import closeSign from '../../../assets/svg/close-sign.svg'

const AddOrEditExamDate = (props) => {
  const t = props.t;
  const currentDate = new Date();

  // useState
  const [languageAndLevel, setLanguageAndLevel] = useState([]);
  const [level, setLevel] = useState(t(levelTranslations.PERUS));
  const [language, setLanguage] = useState(LANGUAGES[0].name);

  // language levels
  const PERUS = t(levelTranslations.PERUS);
  const KESKI = t(levelTranslations.KESKI);
  const YLIN = t(levelTranslations.YLIN);

  const languagesList = (
    <>
      {languageAndLevel.map((item, i) => {
       return (
         <span key={i}>
          <img src={closeSign} alt={'delete'} onClick={() => handleRemove(i)} />
          <p style={{marginLeft: '10px'}}>{item.language}, {item.level}</p>
        </span>
       )
      })}
    </>
  );

  const handleRemove = item => {
    const temp = [...languageAndLevel];
    temp.splice(item, 1);
    setLanguageAndLevel(temp);
  }

  const examTimeGrid = (
    <div className={classes.TimeGrid}>
      <div>
        <label>{t('examDates.choose.registrationTime')}</label>
        <ExamRegistrationDatesSelector registrationPeriods={props.examDates}/>
      </div>
      <div>
        <label>{t('examDates.choose.examDate')}</label>
        <div className={classes.DatePickerWrapper}>
          <DatePicker options={{defaultDate: currentDate}} onChange={() => console.log('selected new date')}/>
        </div>
      </div>
    </div>
  );

  const languageAndLevelGrid = (
    <div className={classes.LanguageAndLevelGrid}>
      <div>
        <label>{t('examDates.choose.examLanguage')}</label>
        <select className={classes.ExamLevels} defaultValue={language} onChange={e => setLanguage(e.target.value)}>
          {LANGUAGES.map((lang) => {
            return <option key={lang.code} value={lang.name}>{lang.name}</option>
          })}
        </select>
      </div>
      <div>
        <label>{t('registration.select.level')}</label>
        <select className={classes.ExamLevels} defaultValue={level} onChange={e => setLevel(e.target.value)}>
          <option value={PERUS}>{PERUS}</option>
          <option value={KESKI}>{KESKI}</option>
          <option value={YLIN}>{YLIN}</option>
        </select>
      </div>
      <div>
        <button
          className={classes.LanguageAddition}
          onClick={() => setLanguageAndLevel(prev => [...prev, {language, level}])}
        >
          {t('examDates.addNew.addLanguage')}
        </button>
      </div>
    </div>
  );

//TODO: move into form and add validation : Formik & yup
  return (
    <>
      <h3 style={{marginBlockStart: '0'}}>{t('examDates.addNew.examDate')}</h3>
      <div className={classes.Form}>
        {examTimeGrid}
        {languageAndLevelGrid}
        <div className={classes.AddedLanguages}>
          {languagesList}
        </div>
      </div>
      <button
        className={classes.AdditionButton}
        onClick={() => props.showAddNewExamDateModalHandler()}
      >
        {t('examDates.addNew.confirm')}
      </button>
    </>
  )
}

// TODO: add connection to redux when backend is ready

export default withTranslation()(AddOrEditExamDate);
