import React, {useEffect, useState} from 'react';
import {withTranslation} from 'react-i18next';
import PropTypes from "prop-types";
import DatePicker from '../../../components/UI/DatePicker/DatePicker';
import {languageToString, levelDescription, levelTranslations} from "../../../util/util";
import {LANGUAGES} from "../../../common/Constants";
import closeOverlay from '../../../assets/svg/close-overlay.svg';
import classes from './AddOrEditExamDate.module.css';
import ToggleSwitch from "../../../components/UI/ToggleSwitch/ToggleSwitch";
import moment from "moment";
import {Form, Formik} from "formik";

//TODO: wire-up form
const AddOrEditExamDate = (props) => {
  const {examDates, onUpdate, t} = props;
  const currentDate = moment(new Date()).format('YYYY-MM-DD');

  const initializeLanguageArray = () => {
    let languageArray = [];
    if (examDates[0].languages && examDates[0].languages.length > 0) {
      examDates[0].languages.map((item) => {
        let language_code = item.language_code;
        let level_code = item.level_code;
        return languageArray.push({language_code, level_code});
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

  //FIXME: does not work when create new exam date

  // useStates
  const [languageAndLevel, setLanguageAndLevel] = useState(initializeLanguageArray);

  //set values to temp array and submit array when editing complete
  const [tempArray, setTempArray] = useState(examDates[0]);

  // TODO: fix form setStates to update array correctly and remove unnecessary states
  const [level_code, setLevel] = useState(t(levelTranslations.PERUS));
  const [language_code, setLanguage] = useState(initializeLanguage);

  const [disabled, setDisabled] = useState(!examDates.post_admission_end_date);
  const [registrationStartDate, setRegistrationStartDate] = useState(initializeStateDate('registration_start_date'));
  const [registrationEndDate, setRegistrationEndDate] = useState(initializeStateDate('registration_end_date'));
  const [examDate, setExamDate] = useState(initializeStateDate('exam_date'));

  const [languagesToAdd, setLanguagesToAdd] = useState([])
  const [newLanguageField, setNewLanguageField] = useState(false);

  // language levels
  const PERUS = t(levelTranslations.PERUS);
  const KESKI = t(levelTranslations.KESKI);
  const YLIN = t(levelTranslations.YLIN);

  useEffect(() => {
  }, [languagesToAdd])

  const handleSetLanguage = (event) => {
    console.log(event)
    const itemToParse = LANGUAGES.filter(item => event === item.name)
    setLanguage(itemToParse[0].code);
  }

  const handleRemoveLanguage = item => {
    const temp = [...languageAndLevel];
    temp.splice(item, 1);
    setLanguageAndLevel(temp);
  }

  // TODO: new localizations to be added!
  //TODO correct date for min and max date
  const FormFields = () => (
    <Formik
      initialValues={{examDate, registrationEndDate, registrationStartDate}}
      onSubmit={() => console.log('sent values: ',)}
      render={({values, setFieldValue}) => (
        <Form className={classes.Form}>
          <div className={classes.TimeGrid}>
            <div>
              <label>{t('examDates.choose.registrationTime')}</label>
              <div className={classes.DateGrid}>
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
          </div>
          <div className={classes.LanguageAndLevelGrid}>
            {props.examDates.length === 1 ?
              <>
                <label>{t('examDates.choose.examLanguage')}</label>
                <label>{t('registration.select.level')}</label>
                <span/>
                <>
                  {languageAndLevel.map((date, i) => {
                    return (
                      <React.Fragment key={date.language_code + i}>
                        <div>
                          <>
                            <select
                              className={classes.ExamLevels}
                              defaultValue={languageToString(date.language_code)}
                              onChange={e => setLanguage(e.target.value)}
                            >
                              {LANGUAGES.map((lang) => {
                                return <option key={lang.code} value={lang.code}>{lang.name}</option>
                              })}
                            </select>
                          </>
                        </div>
                        <div key={date.level_code}>
                          <>
                            <select
                              className={classes.ExamLevels}
                              defaultValue={levelDescription(date.level_code)}
                              onChange={e => setLevel(e.target.value)}
                            >
                              <option value={'PERUS'}>{PERUS}</option>
                              <option value={'KESKI'}>{KESKI}</option>
                              <option value={'YLIN'}>{YLIN}</option>
                            </select>
                          </>
                        </div>
                        <div>
                          <button
                            className={`${classes.LanguageButton} ${classes.RemoveLanguageButton}`}
                            onClick={item => setTempArray(tempArray.filter(removable => removable !== item))}
                          >
                            {'Poista kieli ja taso'}
                          </button>
                        </div>
                      </React.Fragment>
                    )
                  })}
                </>
              </>
              :
              <>
                <div>
                  <label>{t('examDates.choose.examLanguage')}</label>
                  <>
                  <select
                    className={classes.ExamLevels}
                    defaultValue={language_code}
                    onChange={e => setLanguage(e.target.value)}
                  >
                    {LANGUAGES.map((lang) => {
                      return <option key={lang.code} value={lang.name}>{lang.name}</option>
                    })}
                  </select>
                    </>
                </div>
                <div>
                  <label>{t('registration.select.level')}</label>
                  <>
                  <select
                    className={classes.ExamLevels}
                    defaultValue={level_code}
                    onChange={e => setLevel(e.target.value)}
                  >
                    <option value={'PERUS'}>{PERUS}</option>
                    <option value={'KESKI'}>{KESKI}</option>
                    <option value={'YLIN'}>{YLIN}</option>
                  </select>
                    </>
                </div>
              </>
            }
            {props.examDates.length === 1 ?
              <>
                {(newLanguageField === false) ?
                  <div>
                    <button
                      className={classes.AddNewLanguages}
                      data-cy="button-add-post-admission"
                      onClick={() => setNewLanguageField(!newLanguageField)}
                    >
                      {'Lisää uusi kieli'}
                    </button>
                  </div>
                  :
                  <div className={classes.LanguageAndLevelGrid}>
                    <div>
                      <select
                        className={classes.ExamLevels}
                        defaultValue={LANGUAGES[0].name}
                        onChange={e => handleSetLanguage(e.target.value)}
                      >
                        {LANGUAGES.map((lang) => {
                          return <option key={lang.code} value={lang.name}>{lang.name}</option>
                        })}
                      </select>
                    </div>
                    <div>
                      <select className={classes.ExamLevels} defaultValue={LANGUAGES[0].code}
                              onChange={e => setLevel(e.target.value)}>
                        <option value={'PERUS'}>{PERUS}</option>
                        <option value={'KESKI'}>{KESKI}</option>
                        <option value={'YLIN'}>{YLIN}</option>
                      </select>
                    </div>
                    <div>
                      <button
                        style={{marginTop: '4px'}}
                        className={`${classes.LanguageButton} ${classes.LanguageAdditionButton}`}
                        onClick={() => {
                          setNewLanguageField(!newLanguageField)
                          setLanguagesToAdd(prev => [...prev, {language_code, level_code}])
                        }
                        }
                      >
                        {t('examDates.addNew.addLanguage')}
                      </button>
                    </div>
                  </div>
                }
              </>
              :
              <div>
                <button
                  className={`${classes.LanguageButton} ${classes.LanguageAdditionButton}`}
                  onClick={() => setLanguageAndLevel(prev => [...prev, {language_code, level_code}])}
                >
                  {t('examDates.addNew.addLanguage')}
                </button>
              </div>
            }
          </div>
          {props.examDates.length === 1 ?
            <div className={classes.PostAdmission}>
              <label>{'Järjestäjien jälki-ilmoittautuminen'}</label>
              <div className={classes.PostAdmissionContainer}>
                <div className={classes.Toggle}>
                  <ToggleSwitch checked={!disabled} onChange={() => setDisabled(!disabled)}/>
                  <p className={classes.Label}>{'Ei avattu'}</p>
                </div>
                <p className={classes.Label}>Päivämäärät</p>
                <div className={classes.DateGrid}>
                  <div className={disabled ? classes.DisabledPicker : classes.DatePickerWrapper}>
                    <DatePicker
                      id="postAdmissionStart"
                      disabled={disabled}
                      options={{defaultDate: currentDate}}
                      onChange={d => console.log('changed to ', d)}
                    />
                  </div>
                  &nbsp;
                  &ndash;
                  &nbsp;
                  <div className={disabled ? classes.DisabledPicker : classes.DatePickerWrapper}>
                    {/*TODO: which are correct? is start date needed? */}
                    <DatePicker
                      id="postAdmissionEnd"
                      disabled={disabled}
                      options={{
                        defaultDate: values.post_admission_end_date || currentDate,
                        // defaultDate: moment(values.registration_end_date).add(1, 'days').format('YYYY MM DD'),
                        // value: values.postAdmissionEnd,
                        // minDate: moment(values.registration_end_date).add(1, 'days').format('YYYY MM DD'),
                        // maxDate: moment(values.exam_date).add(-1, 'days').format('YYYY MM DD')
                        minDate: moment(values.post_admission_end_date).add(1, 'days').format('YYYY MM DD'),
                        // maxDate: moment(values.exam_date).add(-1, 'days').format('YYYY MM DD')
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
              </div>
            </div>
            :
            <div className={classes.AddedLanguages}>
              {languageAndLevel.map((item, i) => {
                return (
                  <span key={i}>
                    <img src={closeOverlay} alt={'delete'} onClick={() => handleRemoveLanguage(i)}/>
                    <p style={{marginLeft: '10px'}}>{item.language}, {item.level}</p>
                  </span>
                )
              })}
            </div>
          }
          <div>
            <button
              className={classes.ConfirmButton}
              onClick={() => onUpdate()}
            >
              {t('examDates.addNew.confirm')}
            </button>
          </div>
        </Form>
      )}
    />
  );

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
