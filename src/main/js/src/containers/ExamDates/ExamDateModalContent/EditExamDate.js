import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from "prop-types";
import DatePicker from '../../../components/UI/DatePicker/DatePicker';
import { languageToString, levelDescription } from "../../../util/util";
import { LANGUAGES } from "../../../common/Constants";
import closeOverlay from '../../../assets/svg/close-overlay.svg';
import classes from './AddOrEditExamDate.module.css';
import ToggleSwitch from "../../../components/UI/ToggleSwitch/ToggleSwitch";
import LanguageLevelSelector from '../LanguageLevel/LanguageLevelSelector';
import moment from "moment";
import { Form, Formik } from "formik";


const EditExamDate = (props) => {
  const { examDate, t } = props;
  const minDate = examDate && examDate.exam_date && moment(examDate.registration_end_date).add(1, 'days').format('YYYY-MM-DD');
  const maxDate = examDate && examDate.exam_date && moment(examDate.exam_date).add(-1, 'days').format('YYYY-MM-DD');

  const initializeLanguageArray = () => {
    let languageArray = [];
    if (examDate && examDate.languages && examDate.languages.length > 0) {
      examDate.languages.map((item) => {
        let language_code = item.language_code;
        let level_code = item.level_code;
        return languageArray.push({ language_code, level_code });
      });
      return languageArray;
    } else return [];
  }

  const initializeLanguage = () => {
    if (examDate) {
      return examDate.languages[0].language_code
    }
    return LANGUAGES[0].code
  }

  const [languageAndLevel, setLanguageAndLevel] = useState(initializeLanguageArray || []);
  const [postAdmissionEnabled, setPostAdmissionEnabled] = useState(examDate.post_admission_enabled);
  const [postAdmissionStartDate, setPostAdmissionStartDate] = useState(examDate.post_admission_start_date || minDate);
  const [postAdmissionEndDate, setPostAdmissionEndDate] = useState(examDate.post_admission_end_date || maxDate);

  const handleRemoveLanguage = item => {
    const temp = [...languageAndLevel];
    temp.splice(item, 1);
    setLanguageAndLevel(temp);
  }


  const FormFields = () => (
    <Formik
      initialValues={{
        postAdmissionStartDate: postAdmissionStartDate,
        postAdmissionEndDate: postAdmissionEndDate,
        postAdmissionEnabled: postAdmissionEnabled,
        languages: languageAndLevel
      }}
      onSubmit={values => {
        const payload = {
          examDateId: examDate.id,
          postAdmission: {
            post_admission_start_date: values.postAdmissionStartDate,
            post_admission_end_date: values.postAdmissionEndDate,
            post_admission_enabled: values.postAdmissionEnabled,
          },
          languages: languageAndLevel
        }
        props.onSubmit(payload);
      }}
      render={({ values, setFieldValue }) => (
        <Form className={classes.Form}>
          <div className={classes.TimeGrid}>
            <div>
              <div className={classes.DateGrid}>
                <div>
                  <div className={classes.DisabledPicker}>
                    <DatePicker
                      options={{
                        defaultDate: examDate.registration_start_date
                      }}
                      onChange={d => { }}
                      disabled
                    />
                  </div>
                </div>
                &nbsp;
                &ndash;
                &nbsp;
                <div>
                  <div className={classes.DisabledPicker}>
                    <DatePicker
                      options={{
                        defaultDate: examDate.registration_end_date,
                      }}
                      onChange={d => { }}
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={classes.ExamDateGrid}>
              <div className={classes.DisabledPicker}>
                <DatePicker
                  options={{
                    defaultDate: examDate.exam_date,
                  }}
                  onChange={d => { }}
                  disabled
                />
              </div>
            </div>
          </div>
          <div className={classes.LanguageAndLevelGrid}>
            <LanguageLevelSelector
              initialLanguageCode={initializeLanguage()}
              languages={languageAndLevel}
              setLanguages={setLanguageAndLevel}
              modify={!!examDate}
            />
          </div>
          {examDate ?
            <div className={classes.PostAdmission}>
              <label>{t('examDates.edit.postAdmission.title')}</label>
              <div className={classes.PostAdmissionContainer}>
                <div className={classes.Toggle}>
                  <ToggleSwitch checked={postAdmissionEnabled} onChange={() => setPostAdmissionEnabled(!postAdmissionEnabled)} />
                  <p className={classes.Label}>{t('examDates.edit.postAdmission.allow')}</p>
                </div>
                <p className={classes.Label}>{t('examDates.edit.postAdmission.dates')}</p>
                <div className={classes.DateGrid}>
                  <div className={postAdmissionEnabled ? classes.DatePickerWrapper : classes.DisabledPicker}>
                    <DatePicker
                      id="postAdmissionStartDate"
                      disabled={!postAdmissionEnabled}
                      options={{
                        defaultDate: postAdmissionStartDate,
                        minDate,
                        maxDate,
                      }}
                      onChange={d => setPostAdmissionStartDate(moment(d[0]).format('YYYY-MM-DD'))}
                    />
                  </div>
                  &nbsp;
                  &ndash;
                  &nbsp;
                  <div className={postAdmissionEnabled ? classes.DatePickerWrapper : classes.DisabledPicker}>
                    <DatePicker
                      id="postAdmissionEndDate"
                      disabled={!postAdmissionEnabled}
                      options={{
                        defaultDate: postAdmissionEndDate,
                        minDate: (postAdmissionStartDate && moment(postAdmissionStartDate).add(1, 'days').format('YYYY-MM-DD')) || minDate,
                        maxDate
                      }}
                      onChange={d => setPostAdmissionEndDate(moment(d[0]).format('YYYY-MM-DD'))}
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
                    <img src={closeOverlay} alt={'delete'} onClick={() => handleRemoveLanguage(i)} />
                    <p style={{ marginLeft: '10px' }}>{languageToString(item.language_code)}, {levelDescription(item.level_code)}</p>
                  </span>
                )
              })}
            </div>
          }
          <div>
            <button
              type='submit'
              className={classes.ConfirmButton}
            >
              {t('examDates.edit.save')}
            </button>
          </div>
        </Form>
      )}
    />
  );


  return (
    <>
      <h3 style={{ marginBlockStart: '0' }}>{t('examDates.edit.title')}</h3>
      <FormFields />
    </>
  );
}

EditExamDate.propTypes = {
  examDate: PropTypes.shape({
    exam_date: PropTypes.string.isRequired,
    registration_end_date: PropTypes.string.isRequired,
    registration_start_date: PropTypes.string.isRequired
  }).isRequired,
  onSubmit: PropTypes.func.isRequired
}

export default withTranslation()(EditExamDate);
