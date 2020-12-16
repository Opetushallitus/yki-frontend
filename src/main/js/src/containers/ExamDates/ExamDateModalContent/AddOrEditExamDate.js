import React, {useState} from 'react';
import {withTranslation} from 'react-i18next';
import PropTypes from "prop-types";
import DatePicker from '../../../components/UI/DatePicker/DatePicker';
import {languageToString, levelDescription, levelTranslations} from "../../../util/util";
import {LANGUAGES} from "../../../common/Constants";
import closeOverlay from '../../../assets/svg/close-overlay.svg';
import classes from './AddOrEditExamDate.module.css';
import ToggleSwitch from "../../../components/UI/ToggleSwitch/ToggleSwitch";
import LanguageLevelSelector from '../LanguageLevel/LanguageLevelSelector';
import moment from "moment";
import {Form, Formik} from "formik";

//TODO: wire-up form
const AddOrEditExamDate = (props) => {
  const {examDates, disabledDates, t} = props;
  const currentDate = moment(new Date()).format('YYYY-MM-DD');
  console.log('ADD OR EDIT EXAM DATE')


  const initializeLanguageArray = () => {
    let languageArray = [];
    if (examDates.length > 0 && examDates[0].languages && examDates[0].languages.length > 0) {
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
    return LANGUAGES[0].code
  }

  const initializeStateDate = (value) => {
    if (examDates.length === 1) {
      return examDates[0][value]
    }
    return currentDate;
  }

  // useStates
  const [languageAndLevel, setLanguageAndLevel] = useState(initializeLanguageArray || []);
  const [level_code, setLevel] = useState('PERUS');
  const [language_code, setLanguage] = useState(initializeLanguage);
  const [disabled, setDisabled] = useState(!examDates.post_admission_end_date);
  const [registrationStartDate, setRegistrationStartDate] = useState(initializeStateDate('registration_start_date'));
  const [registrationEndDate, setRegistrationEndDate] = useState(initializeStateDate('registration_end_date'));
  const [examDate, setExamDate] = useState(initializeStateDate('exam_date'));
  const [newLanguageField, setNewLanguageField] = useState(false);

  const handleRemoveLanguage = item => {
    const temp = [...languageAndLevel];
    temp.splice(item, 1);
    setLanguageAndLevel(temp);
  }

  const handleEdit = (key, value, original) => {
    original[key] = value;
  }

  const handleAddNewLanguage = () => {
    setNewLanguageField(!newLanguageField);
    setLanguageAndLevel(prev => [...prev, {language_code, level_code}]);
    setLanguage(LANGUAGES[0].code);
    setLevel('PERUS');
  }

/*   const getFirstFreeDate = (date) => {
    if (!date) return ""
    const momentDate = moment(date).format('YYYY-MM-DD')
    if (R.includes(momentDate, disabledDates)) {
      return momentDate.add(1, 'days').format('YYYY-MM-DD');
    }
    return momentDate;
  } */


  // TODO: new localizations to be added!
  //TODO correct date for min and max date
  const FormFields = () => (
    <Formik
      initialValues={{
        examDate,
        registrationEndDate,
        registrationStartDate,
        languages: languageAndLevel
      }}
      onSubmit={values => {
        console.log('submit values: ', values)
        const payload = {
          exam_date: values.examDate,
          registration_end_date: values.registrationEndDate,
          registration_start_date: values.registrationStartDate,
          //post_admission_start_date: values.postAdmissionStartDate,
          //post_admission_end_date: values.postAdmissionEndDate,
          languages: languageAndLevel
        }
        console.log('sent values: ', payload);
        //TODO: create redux-action
        props.onSubmit(payload);
      }}
      render={({values, setFieldValue}) => (
        <Form className={classes.Form}>
          <div className={classes.TimeGrid}>
            <div>
              <label>{t('examDates.choose.registrationTime')}</label>
              <div className={classes.DateGrid}>
                <div>
                  <div className={classes.DatePickerWrapper}>
                    <DatePicker
                      id="registrationStartDate"
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
                      id="registrationEndDate"
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
                    id='examDate'
                    options={{
                      value: values.examDate,
                      defaultDate: moment(examDate).add(14, 'day').format('YYYY MM DD'),
                      minDate: moment(examDate).add(14, 'day').format('YYYY MM DD'),
                      disable: disabledDates || []
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
          <LanguageLevelSelector
              initialLanguageCode={initializeLanguage()}
              languages={languageAndLevel}
              setLanguages={setLanguageAndLevel}
            />
          </div>
          {props.examDates.length === 1 ?
            <div className={classes.PostAdmission}>
              <label>{'Järjestäjien jälki-ilmoittautuminen'}</label>
              <div className={classes.PostAdmissionContainer}>
                <div className={classes.Toggle}>
                  <ToggleSwitch checked={!disabled} onChange={() => setDisabled(!disabled)}/>
                  <p className={classes.Label}>{'Ei avattu'}</p>
                </div>
                <p className={classes.Label}>{'Päivämäärät'}</p>
                <div className={classes.DateGrid}>
                  <div className={disabled ? classes.DisabledPicker : classes.DatePickerWrapper}>
                    <DatePicker
                      id="postAdmissionStartDate"
                      disabled={disabled}
                      options={{defaultDate: currentDate}}
                      onChange={d => setFieldValue('postAdmissionStartDate', moment(d[0]).format('YYYY-MM-DD'))}
                    />
                  </div>
                  &nbsp;
                  &ndash;
                  &nbsp;
                  <div className={disabled ? classes.DisabledPicker : classes.DatePickerWrapper}>
                    {/*TODO: which are correct? is start date needed? */}
                    <DatePicker
                      id="postAdmissionEndDate"
                      disabled={disabled}
                      options={{
                        defaultDate: values.postAdmissionEnd || currentDate,
                        // value: values.postAdmissionEnd,
                        // minDate: moment(values.registration_end_date).add(1, 'days').format('YYYY MM DD'),
                        minDate: moment(values.postAdmissionStartDate).add(1, 'days').format('YYYY MM DD'),
                        maxDate: moment(examDate).add(-1, 'days').format('YYYY MM DD')
                      }}
                      onChange={d => setFieldValue('postAdmissionEndDate', moment(d[0]).format('YYYY-MM-DD'))}
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
                    <p style={{marginLeft: '10px'}}>{languageToString(item.language_code)}, {levelDescription(item.level_code)}</p>
                  </span>
                )
              })}
            </div>
          }
          <div>
            <button
              type='submit'
              className={classes.ConfirmButton}
              //onClick={() => onUpdate()}
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

  const createView = () => {
    return (
    <>
      <h3 style={{marginBlockStart: '0'}}>{t('examDates.addNew.examDate')}</h3>
      <FormFields/>
    </>
  )};

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
  onSubmit: PropTypes.func.isRequired,
  disabledDates: PropTypes.arrayOf(PropTypes.string)
}

export default withTranslation()(AddOrEditExamDate);
