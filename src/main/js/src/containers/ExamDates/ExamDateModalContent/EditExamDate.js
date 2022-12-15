import { Form, Formik } from 'formik';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';

import { LANGUAGES } from '../../../common/Constants';
import DatePicker from '../../../components/UI/DatePicker/DatePicker';
import ToggleSwitch from '../../../components/UI/ToggleSwitch/ToggleSwitch';
import LanguageLevelSelector from '../LanguageLevel/LanguageLevelSelector';
import classes from './AddOrEditExamDate.module.css';

const EditExamDate = props => {
  const { examDate, t } = props;

  const minDate =
    examDate &&
    examDate.exam_date &&
    moment(examDate.registration_end_date)
      .add(1, 'days')
      .format('YYYY-MM-DD');

  const maxDate =
    examDate &&
    examDate.exam_date &&
    moment(examDate.exam_date)
      .add(-1, 'days')
      .format('YYYY-MM-DD');

  const initializeLanguageArray = () => {
    let languageArray = [];
    if (examDate && examDate.languages && examDate.languages.length > 0) {
      examDate.languages.map(item => {
        let language_code = item.language_code;
        let level_code = item.level_code;
        return languageArray.push({ language_code, level_code });
      });
      return languageArray;
    } else return [];
  };

  const initializeLanguageAndLevel = () => {
    if (examDate && examDate.languages && examDate.languages.length > 1) {
      const { languages } = examDate;
      return {
        language_code: languages[languages.length - 1].language_code,
        level_code: languages[languages.length - 1].level_code,
      };
    }
    if (languageAndLevel.length > 0) {
      const lastItem = languageAndLevel[languageAndLevel.length - 1];
      return {
        language_code: lastItem.language_code,
        level_code: lastItem.level_code,
      };
    }
    return {
      language_code: LANGUAGES[0].code,
      level_code: 'PERUS',
    };
  };

  const [languageAndLevel, setLanguageAndLevel] = useState(
    initializeLanguageArray || [],
  );
  const [postAdmissionEnabled, setPostAdmissionEnabled] = useState(
    examDate.post_admission_enabled,
  );
  const [postAdmissionStartDate, setPostAdmissionStartDate] = useState(
    examDate.post_admission_start_date || minDate,
  );
  const [postAdmissionEndDate, setPostAdmissionEndDate] = useState(
    examDate.post_admission_end_date || maxDate,
  );
  const { language_code, level_code } = initializeLanguageAndLevel();

  const deleteDisabled = examDate.exam_session_count && examDate.exam_session_count > 0;

  const confirmDeletion = (e) => {
    if (window.confirm(t('examDates.edit.delete.confirm'))) {
      props.onDelete(examDate.id);
    } else {
      e.preventDefault();
    }
  };

  const FormFields = () => (
    <Formik
      initialValues={{
        postAdmissionStartDate: postAdmissionStartDate,
        postAdmissionEndDate: postAdmissionEndDate,
        postAdmissionEnabled: postAdmissionEnabled,
        languages: languageAndLevel,
      }}
      onSubmit={values => {
        const payload = {
          examDateId: examDate.id,
          postAdmission: {
            post_admission_start_date: values.postAdmissionStartDate,
            post_admission_end_date: values.postAdmissionEndDate,
            post_admission_enabled: values.postAdmissionEnabled,
          },
          languages: languageAndLevel,
        };
        props.onSave(payload);
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
                        defaultDate: examDate.registration_start_date,
                      }}
                      onChange={d => {}}
                      disabled
                    />
                  </div>
                </div>
                &nbsp; &ndash; &nbsp;
                <div>
                  <div className={classes.DisabledPicker}>
                    <DatePicker
                      options={{
                        defaultDate: examDate.registration_end_date,
                      }}
                      onChange={d => {}}
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
                  onChange={d => {}}
                  disabled
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
              modify={!!examDate}
            />
          </div>

          <div className={classes.PostAdmission}>
            <label>{t('examDates.edit.postAdmission.title')}</label>
            <div className={classes.PostAdmissionContainer}>
              <div className={classes.Toggle}>
                <ToggleSwitch
                  dataCy="exam-dates-modify-post-admission-toggle"
                  checked={postAdmissionEnabled}
                  onChange={() =>
                    setPostAdmissionEnabled(!postAdmissionEnabled)
                  }
                />
                <p className={classes.Label}>
                  {t('examDates.edit.postAdmission.allow')}
                </p>
              </div>
              <p className={classes.Label}>
                {t('examDates.edit.postAdmission.dates')}
              </p>
              <div className={classes.DateGrid}>
                <div
                  className={
                    postAdmissionEnabled
                      ? classes.DatePickerWrapper
                      : classes.DisabledPicker
                  }
                >
                  <DatePicker
                    id="postAdmissionStartDate"
                    data-cy="exam-dates-modify-post-admission-start-date"
                    disabled={!postAdmissionEnabled}
                    options={{
                      defaultDate: postAdmissionStartDate,
                      minDate,
                      maxDate,
                    }}
                    locale={props.i18n.language}
                    onChange={d =>
                      setPostAdmissionStartDate(
                        moment(d[0]).format('YYYY-MM-DD'),
                      )
                    }
                  />
                </div>
                &nbsp; &ndash; &nbsp;
                <div
                  className={
                    postAdmissionEnabled
                      ? classes.DatePickerWrapper
                      : classes.DisabledPicker
                  }
                >
                  <DatePicker
                    id="postAdmissionEndDate"
                    data-cy="exam-dates-modify-post-admission-end-date"
                    disabled={!postAdmissionEnabled}
                    options={{
                      defaultDate: postAdmissionEndDate,
                      minDate:
                        (postAdmissionStartDate &&
                          moment(postAdmissionStartDate)
                            .add(1, 'days')
                            .format('YYYY-MM-DD')) ||
                        minDate,
                      maxDate,
                    }}
                    onChange={d =>
                      setPostAdmissionEndDate(moment(d[0]).format('YYYY-MM-DD'))
                    }
                    locale={props.i18n.language}
                    tabIndex="1"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={classes.ActionButtonsGrid}>
            <button
              data-cy="exam-dates-modify-save"
              type="submit"
              className={classes.ConfirmButton}
            >
              {t('examDates.edit.save')}
            </button>
            <button
              data-cy="exam-dates-modify-delete"
              className={`${classes.DeleteButton} ${deleteDisabled && classes.DisabledButton}`}
              onClick={confirmDeletion}
              disabled={deleteDisabled}
            >
              {t('examDates.edit.delete')}
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
};

EditExamDate.propTypes = {
  examDate: PropTypes.shape({
    exam_date: PropTypes.string.isRequired,
    registration_end_date: PropTypes.string.isRequired,
    registration_start_date: PropTypes.string.isRequired,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default withTranslation()(EditExamDate);
