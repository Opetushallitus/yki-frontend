import React, {useEffect, useState} from 'react';
import {withTranslation} from 'react-i18next';
import DatePicker from '../../../components/UI/DatePicker/DatePicker';

import classes from './AddExamDateModal.module.css';
import ExamRegistrationDatesSelector from "../RegistrationPeriodSelector/RegistrationPeriodSelector";
import {levelTranslations} from "../../../util/util";
import {LANGUAGES} from "../../../common/Constants";

import closeSign from '../../../assets/svg/close-sign.svg'

const AddExamDateModal = (props) => {
  const t = props.t;
  const currentDate = new Date();

  const [languageAndLevel, setLanguageAndLevel] = useState([]);
  const [level, setLevel] = useState(t(levelTranslations.PERUS));
  const [language, setLanguage] = useState(LANGUAGES[0].name);

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

  //TODO: move into form and add validation : Formik & yup
  return (
    <>
      <h3 style={{marginBlockStart: '0'}}>{t('examDates.addNew.examDate')}</h3>
      <div className={classes.Form}>
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
        <div className={classes.LevelGrid}>
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
              <option value={t(levelTranslations.PERUS)}>{t(levelTranslations.PERUS)}</option>
              <option value={t(levelTranslations.KESKI)}>{t(levelTranslations.KESKI)}</option>
              <option value={t(levelTranslations.YLIN)}>{t(levelTranslations.YLIN)}</option>
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

export default withTranslation()(AddExamDateModal);
