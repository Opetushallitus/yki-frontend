import { Form, Formik } from 'formik';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';

import { LANGUAGES } from '../../../common/Constants';
import ExamDateDate from "./ExamDateDate";
import LanguageLevelSelector from './LanguageLevelSelector';
import RegistrationPeriod from "./RegistrationPeriod";

import classes from './ExamDateView.module.css';

const ExamDateView = props => {
  const { t, examDate, disabledDates } = props;

  const initialLanguageLevels = () => {
    if (!examDate || !examDate.languages) {
      return [];
    }

    return examDate.languages.map(item => {
      const language_code = item.language_code;
      const level_code = item.level_code;

      return { language_code, level_code };
    });
  };

  const [registrationStartDate, setRegistrationStartDate] = useState(examDate && examDate.registration_start_date);
  const [registrationEndDate, setRegistrationEndDate] = useState(examDate && examDate.registration_end_date);
  const [date, setDate] = useState(examDate && examDate.exam_date);

  const [languageLevels, setLanguageLevels] = useState(initialLanguageLevels());
  const [language_code, setLanguageCode] = useState(LANGUAGES[0].code);
  const [level_code, setLevelCode] = useState(LANGUAGES[0].levels[0]);

  const addButtonDisabled = () => {
    let languageLevelAdded = false;

    languageLevels.forEach((l) => {
      if (l.language_code === language_code && l.level_code === level_code) {
        languageLevelAdded = true;
      }
    });

    return languageLevelAdded;
  };

  const handleAddLanguageLevel = () => {
    setLanguageLevels([...languageLevels, { language_code, level_code }]);
  };

  const handleRemoveLanguageLevel = item => {
    const updatedLanguageLevels = [...languageLevels];
    updatedLanguageLevels.splice(item, 1);

    setLanguageLevels(updatedLanguageLevels);
  };

  const maxRegistrationStartDate = registrationEndDate && moment(registrationEndDate).subtract(1, 'days').format('YYYY-MM-DD');
  const minRegistrationEndDate = registrationStartDate && moment(registrationStartDate).add(1, 'days').format('YYYY-MM-DD');
  const maxRegistrationEndDate = date && moment(date).subtract(1, 'days').format('YYYY-MM-DD');
  const minDate = registrationEndDate && moment(registrationEndDate).add(1, 'days').format('YYYY-MM-DD');

  const dateChangeDisabled = examDate && examDate.exam_session_count && examDate.exam_session_count > 0;
  const languageChangesDisabled = dateChangeDisabled;
  const deleteDisabled = dateChangeDisabled;

  const submitEnabled =
    languageLevels.length > 0 &&
    date &&
    registrationStartDate &&
    registrationEndDate &&
    moment(date).isAfter(registrationEndDate, 'day') &&
    moment(registrationEndDate).isAfter(registrationStartDate, 'day');

  const confirmDeletion = (e) => {
    if (window.confirm(t('examDates.edit.delete.confirm'))) {
      props.onDelete(examDate.id);
    } else {
      e.preventDefault();
    }
  };

  const FormFields = () => (
    <Formik
      initialValues={{}}
      onSubmit={values => {
        const createExamDatePayload = {
          exam_date: date,
          registration_end_date: registrationEndDate,
          registration_start_date: registrationStartDate,
          languages: languageLevels,
        };

        const payload = !examDate
          ? createExamDatePayload
          : {
            ...createExamDatePayload,
            examDateId: examDate.id,
          };

        props.onSave(payload);
      }}
      render={({ values, setFieldValue }) => (
        <Form className={classes.Form}>
          <ExamDateDate
            isEnabled={!dateChangeDisabled}
            date={date}
            minDate={minDate}
            setDate={setDate}
            disabledDates={disabledDates}
          />
          <RegistrationPeriod
            startDate={registrationStartDate}
            endDate={registrationEndDate}
            maxStartDate={maxRegistrationStartDate}
            minEndDate={minRegistrationEndDate}
            maxEndDate={maxRegistrationEndDate}
            setStartDate={setRegistrationStartDate}
            setEndDate={setRegistrationEndDate}
          />
          <div className={classes.LanguageAndLevelGrid}>
            <LanguageLevelSelector
              languageLevels={languageLevels}
              language_code={language_code}
              level_code={level_code}
              setLanguageCode={setLanguageCode}
              setLevelCode={setLevelCode}
              handleAddLanguageLevel={handleAddLanguageLevel}
              handleRemoveLanguageLevel={handleRemoveLanguageLevel}
              addDisabled={addButtonDisabled()}
              changesEnabled={!languageChangesDisabled}
            />
          </div>
          <div className={classes.ActionButtonsGrid}>
            <>
              <button
                data-cy="exam-dates-modify-save"
                type="submit"
                className={
                  submitEnabled ? classes.ConfirmButton : classes.DisabledButton
                }
                disabled={!submitEnabled}
              >
                {examDate ? t('examDates.edit.save') : t('examDates.addNew.confirm')}
              </button>
              {examDate && (
                <button
                  data-cy="exam-dates-modify-delete"
                  className={`${classes.DeleteButton} ${deleteDisabled && classes.DisabledButton}`}
                  onClick={confirmDeletion}
                  disabled={deleteDisabled}
                >
                  {t('examDates.edit.delete')}
                </button>
              )}
            </>
          </div>
        </Form>
      )}
    />
  );

  return (
    <>
      <h3 style={{ marginBlockStart: '0' }}>
        {examDate ? t('examDates.edit.title') : t('examDates.addNew.examDate')}
      </h3>
      {!!dateChangeDisabled && (
        <p>{t('examDates.edit.restricted')}</p>
      )}
      <FormFields />
    </>
  );
};

ExamDateView.propTypes = {
  examDate: PropTypes.shape({
    exam_date: PropTypes.string.isRequired,
    registration_end_date: PropTypes.string.isRequired,
    registration_start_date: PropTypes.string.isRequired,
  }),
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  disabledDates: PropTypes.arrayOf(PropTypes.string),
};

export default withTranslation()(ExamDateView);
