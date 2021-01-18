import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from "prop-types";
import DatePicker from '../../../components/UI/DatePicker/DatePicker';
import { languageToString, levelDescription } from "../../../util/util";
import { LANGUAGES } from "../../../common/Constants";
import closeOverlay from '../../../assets/svg/close-overlay.svg';
import classes from './AddOrEditExamDate.module.css';
import LanguageLevelSelector from '../LanguageLevel/LanguageLevelSelector';
import moment from "moment";
import { Form, Formik } from "formik";

const AddExamDate = (props) => {
  const { examDates, disabledDates, t } = props;


  const initializeStartDate = () => {
    if (examDates.length === 1) {
      return examDates[0].registration_start_date;
    }
    return moment(new Date()).format('YYYY-MM-DD');
  }

  const initializeEndDate = () => {
    if (examDates.length === 1) {
      return examDates[0].registration_end_date;
    }
    return moment(new Date()).add(1, 'days').format('YYYY-MM-DD');
  }

  // useStates
  const [languageAndLevel, setLanguageAndLevel] = useState(initializeLanguageArray || []);
  const [registrationStartDate, setRegistrationStartDate] = useState(initializeStartDate());
  const [registrationEndDate, setRegistrationEndDate] = useState(initializeEndDate());

  const initializeLanguageArray = () => {
    let languageArray = [];
    if (examDates.length > 0 && examDates[0].languages && examDates[0].languages.length > 0) {
      examDates[0].languages.map((item) => {
        let language_code = item.language_code;
        let level_code = item.level_code;
        return languageArray.push({ language_code, level_code });
      });
      return languageArray;
    } else return [];
  }


  const initializeLanguageAndLevel = () => {
    if (examDates.length === 1) {
      const langs = examDates[0].languages;
      return {
        language_code: languageToString(langs[langs.length - 1].language_code),
        level_code: langs[langs.length - 1].level_code
      }
    }
    if (languageAndLevel.length > 0) {
      const lastItem = languageAndLevel[languageAndLevel.length - 1]
      return {
        language_code: lastItem.language_code,
        level_code: lastItem.level_code
      }
    }
    return {
      language_code: LANGUAGES[0].code,
      level_code: 'PERUS'
    }
  }

  const { language_code, level_code } = initializeLanguageAndLevel();

  const [examDate, setExamDate] = useState((registrationEndDate && moment(registrationEndDate).add(1, 'days').format('YYYY-MM-DD')) || moment(new Date()).add(1, 'days').format('YYYY-MM-DD'));

  const minExamDate = (registrationEndDate && moment(registrationEndDate).add(1, 'days').format('YYYY-MM-DD')) || moment(new Date()).add(1, 'days').format('YYYY-MM-DD')

  const handleRemoveLanguage = item => {
    const temp = [...languageAndLevel];
    temp.splice(item, 1);
    setLanguageAndLevel(temp);
  }

  const isValid =
    moment(registrationEndDate).isAfter(registrationStartDate, 'day')
    && moment(examDate).isAfter(registrationEndDate, 'day')
    && (languageAndLevel && languageAndLevel.length > 0);



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
        const payload = {
          exam_date: values.examDate,
          registration_end_date: values.registrationEndDate,
          registration_start_date: values.registrationStartDate,
          languages: languageAndLevel
        }
        props.onSubmit(payload);
      }}
      render={({ values, setFieldValue }) => (
        <Form className={classes.Form}>
          <div className={classes.TimeGrid}>
            <div>
              <label>{t('examDates.choose.registrationTime')}</label>
              <div className={classes.DateGrid}>
                <div>
                  <div className={classes.DatePickerWrapper}>
                    <DatePicker
                      data-cy="exam-date-new-registration-start"
                      id="registrationStartDate"
                      options={{ defaultDate: registrationStartDate }}
                      onChange={d => setRegistrationStartDate(moment(d[0]).format('YYYY-MM-DD'))}
                      locale={props.i18n.language}
                    />
                  </div>
                </div>
                &nbsp;
                &ndash;
                &nbsp;
                <div>
                  <div className={classes.DatePickerWrapper}>
                    <DatePicker
                      data-cy="exam-date-new-registration-end"
                      id="registrationEndDate"
                      options={{
                        defaultDate: registrationEndDate,
                        minDate: registrationStartDate,
                      }}
                      onChange={d => setRegistrationEndDate(moment(d[0]).format('YYYY-MM-DD'))}
                      locale={props.i18n.language}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={classes.ExamDateGrid}>
              <label>{t('examDates.choose.examDate')}</label>
              <div className={classes.DatePickerWrapper}>
                <DatePicker
                  data-cy="exam-date-new-exam-date"
                  id='exam_date'
                  options={{
                    defaultDate: examDate,
                    minDate: minExamDate,
                    disable: disabledDates || []
                  }}
                  onChange={d => setExamDate(moment(d[0]).format('YYYY-MM-DD'))}
                  locale={props.i18n.language}
                />
              </div>
            </div>
          </div>
          <div className={classes.LanguageAndLevelGrid}>
            <LanguageLevelSelector
              initialLanguageCode={language_code}
              initialLevelCode={level_code}
              languages={languageAndLevel}
              setLanguages={setLanguageAndLevel}
            />
          </div>
          <div className={classes.AddedLanguages}>
            {languageAndLevel.map((item, i) => {
              return (
                <span key={i}>
                  <img src={closeOverlay} alt={'delete'} onClick={() => handleRemoveLanguage(i)} />
                  <p style={{ marginLeft: '10px' }}>{languageToString(item.language_code)}, {levelDescription(item.level_code)}</p>
                </span>
              )
            })}
          </div>
          <div className={classes.ActionButtons}>
            <button
              data-cy="exam-dates-button-save-new"
              type='submit'
              className={isValid ? classes.ConfirmButton : classes.DisabledButton}
              disabled={!isValid}
            >
              {t('examDates.addNew.confirm')}
            </button>
          </div>
        </Form>
      )}
    />
  );


  const createView = () => {
    return (
      <>
        <h3 style={{ marginBlockStart: '0' }}>{t('examDates.addNew.examDate')}</h3>
        <FormFields />
      </>
    )
  };

  return (
    createView()
  );
}

// TODO: add connection to redux when backend is ready
AddExamDate.propTypes = {
  examDates: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]).isRequired,
  onSubmit: PropTypes.func.isRequired,
  disabledDates: PropTypes.arrayOf(PropTypes.string)
}

export default withTranslation()(AddExamDate);
