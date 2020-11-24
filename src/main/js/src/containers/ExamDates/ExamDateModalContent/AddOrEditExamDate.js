import React, {useState} from 'react';
import {withTranslation} from 'react-i18next';
import PropTypes from "prop-types";
import DatePicker from '../../../components/UI/DatePicker/DatePicker';
import {languageToString, levelTranslations} from "../../../util/util";
import {LANGUAGES} from "../../../common/Constants";
import closeOverlay from '../../../assets/svg/close-overlay.svg';
import classes from './AddOrEditExamDate.module.css';
import ToggleSwitch from "../../../components/UI/ToggleSwitch/ToggleSwitch";
import moment from "moment";
import {Form, Formik, ErrorMessage} from "formik";

//TODO: wire-up form
const AddOrEditExamDate = (props) => {
  const {examDates, onUpdate, t} = props;
  const currentDate = moment(new Date()).format('YYYY-MM-DD');

  const initializeLanguageArray = () => {
    let languageArray = [];
    if (examDates.languages && examDates.languages.length > 0) {
      examDates.languages.map((item) => {
        let language = languageToString(item.language_code);
        //TODO: add correct level when provided from backend
        let level = t(levelTranslations.PERUS)
        return languageArray.push({language, level});
      });
      return languageArray;
    } else return [];
  }

  const initializeLanguage = () => {
    if (examDates.length === 1) {
      return languageToString(examDates[0].languages[0].language_code)
    }
    return LANGUAGES[0].name
  }

  const initializeStateDate = (value) => {
    if (examDates.length === 1) {
      return examDates[0][value]
    }
    return currentDate;
  }

  // useState
  const [languageAndLevel, setLanguageAndLevel] = useState(initializeLanguageArray);
  const [level, setLevel] = useState(t(levelTranslations.PERUS));
  const [language, setLanguage] = useState(initializeLanguage);
  const [disabled, setDisabled] = useState(true);

  const [registrationStartDate, setRegistrationStartDate] = useState(initializeStateDate('registration_start_date'));
  const [registrationEndDate, setRegistrationEndDate] = useState(initializeStateDate('registration_end_date'));
  const [examDate, setExamDate] = useState(initializeStateDate('exam_date'));

  // language levels
  const PERUS = t(levelTranslations.PERUS);
  const KESKI = t(levelTranslations.KESKI);
  const YLIN = t(levelTranslations.YLIN);

  const handleRemoveLanguage = item => {
    const temp = [...languageAndLevel];
    temp.splice(item, 1);
    setLanguageAndLevel(temp);
  }

  const languagesList = (
    <>
      {languageAndLevel.map((item, i) => {
        return (
          <span key={i}>
          <img src={closeOverlay} alt={'delete'} onClick={() => handleRemoveLanguage(i)}/>
          <p style={{marginLeft: '10px'}}>{item.language}, {item.level}</p>
         </span>
        )
      })}
    </>
  );

  // TODO: new localizations to be added!
  const registrationDateGrid = (
    <div>
      <label>{t('examDates.choose.registrationTime')}</label>
      <div className={classes.RegistrationDateGrid}>
        <div>
          <div className={classes.DatePickerWrapper}>
            <DatePicker
              id="registration_start_date"
              options={{defaultDate: registrationStartDate}}
              onChange={d => setRegistrationStartDate(moment(d[0]).format('YYYY-MM-DD'))}
            />
          </div>
        </div>
        &nbsp;
        &ndash;
        &nbsp;
        <div>
          <div className={classes.DatePickerWrapper}>
            <DatePicker
              id={'registration_end_date'}
              options={{
                defaultDate: registrationEndDate,
                minDate: registrationEndDate,
              }}
              onChange={d => setRegistrationEndDate(moment(d[0]).format('YYYY-MM-DD'))}
            />
          </div>
        </div>
      </div>
    </div>
  );

  //TODO correct date for min and max date
  const examDateGrid = (
    <div className={classes.ExamDateGrid}>
      <label>{t('examDates.choose.examDate')}</label>
      <div className={classes.DatePickerWrapper}>
        {examDate === currentDate ?
          <DatePicker
            id='exam_date'
            options={{
              defaultDate: moment(examDate).add(14, 'day').format('YYYY MM DD'),
              minDate: moment(examDate).add(14, 'day').format('YYYY MM DD'),
            }}
            onChange={d => setExamDate(moment(d[0]).format('YYYY-MM-DD'))}
          />
          :
          <DatePicker
            id='exam_date'
            options={{
              defaultDate: examDate,
              minDate: examDate,
            }}
            onChange={d => setExamDate(moment(d[0]).format('YYYY-MM-DD'))}
          />
        }
      </div>
    </div>
  );

  const languageAndLevelGrid = (
    <div className={classes.LanguageAndLevelGrid}>
      <div>
        <label>{t('examDates.choose.examLanguage')}</label>
        <select
          className={classes.ExamLevels} defaultValue={language}
          onChange={e => setLanguage(e.target.value)}
        >
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
      {props.examDates. length === 1 ?
        null :
        <div>
          <button
            className={classes.LanguageAddition}
            onClick={() => setLanguageAndLevel(prev => [...prev, {language, level}])}
          >
            {t('examDates.addNew.addLanguage')}
          </button>
        </div>
      }
    </div>
  );

  const postAdmissionToggle = (
    <>
      <label>{'Järjestäjien jälki-ilmoittautuminen'}</label>
      <div className={classes.PostAdmissionContainer}>
        <div className={classes.Toggle}>
          <ToggleSwitch onChange={() => setDisabled(!disabled)}/>
          <p>{'Ei avattu'}</p>
        </div>
        <p className={classes.Label}>Päivämäärät</p>
        <div className={disabled ? classes.DisabledPicker : classes.DatePickerWrapper}>
          <DatePicker
            disabled={disabled}
            options={{defaultDate: currentDate}}
            onChange={d => console.log('changed to ', d)}
          />
        </div>
        <div className={disabled ? classes.DisabledPicker : classes.DatePickerWrapper}>
          <DatePicker
            id="postAdmissionEnd"
            disabled={disabled}
            options={{
              defaultDate: examDates.post_admission_end_date,
              // value: values.postAdmissionEnd,
              minDate: moment(examDates.registration_end_date).add(1, 'days').format('YYYY MM DD'),
              maxDate: moment(examDates.exam_date).add(-1, 'days').format('YYYY MM DD')
            }}
            onChange={d =>
              console.log(
                'postAdmissionEnd: ',
                moment(d[0]).format('YYYY-MM-DD'),
              )
            }
            locale={props.i18n.language}
            tabIndex="1"
          />
        </div>
      </div>
    </>
  );

  const FormFields = () => (
    <Formik
      initialValues={{examDate, registrationEndDate, registrationStartDate}}
      onSubmit={() => console.log('sent values: ')}
      render={({values, setFieldValue}) => (
        <Form className={classes.Form}>
          <div className={classes.TimeGrid}>
            {registrationDateGrid}
            {examDateGrid}
          </div>
          {languageAndLevelGrid}
          {props.examDates.length === 1 ?
            <>
              {postAdmissionToggle}
            </>
            :
            <div className={classes.AddedLanguages}>
              {languagesList}
            </div>
          }
          <div>
            <button
              className={classes.AdditionButton}
              onClick={() => onUpdate()}
            >
              {t('examDates.addNew.confirm')}
            </button>
          </div>
        </Form>
      )}
    />
  );

  /*
  const editView = () => (
    <div>
      <h3 style={{marginBlockStart: '0'}}>Muokkaa aikaa</h3>
      <div className={classes.Form}>
        <div className={classes.EditViewTop}>
          <div>
            <label>{t('examDates.choose.examDate')}</label>
            <div className={classes.DatePickerWrapper}>
              <DatePicker options={{defaultDate: examDates[0].exam_date}}
                          onChange={() => console.log('selected new date')}/>
            </div>
          </div>
          <div>
            {postAdmissionToggle}
          </div>
        </div>
        {languageAndLevelGrid}
        <div className={classes.AddedLanguages}>
          {languagesList}
        </div>
      </div>
      <button
        className={classes.AdditionButton}
        onClick={() => onUpdate()}
      >
        {t('examDates.addNew.confirm')}
      </button>
    </div>
  );
   */

  const editView = () => (
    <>
      <h3 style={{marginBlockStart: '0'}}>Muokkaa aikaa</h3>
      <FormFields/>
    </>
  );

  const createView = () => (
    <>
      <h3 style={{marginBlockStart: '0'}}>{t('examDates.addNew.examDate')}</h3>
      <FormFields/>
    </>
  );

  return (
    examDates.length === 1 ? editView() : createView()
  );
}

// TODO: add connection to redux when backend is ready
AddOrEditExamDate.propTypes = {
  examDates: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]).isRequired,
  onUpdate: PropTypes.func.isRequired
}

export default withTranslation()(AddOrEditExamDate);
