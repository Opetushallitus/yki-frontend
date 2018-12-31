import React from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import moment from 'moment';
import { withNamespaces } from 'react-i18next';
import * as R from 'ramda';

import classes from './ExamSessionForm.module.css';
import Button from '../UI/Button/Button';
import RadioButton from '../UI/RadioButton/RadioButton';
import {
  DATE_FORMAT,
  DATE_FORMAT_WITHOUT_YEAR,
  CODE_TO_LEVEL,
} from '../../common/Constants';
import { languageToString } from '../../util/registryUtil';

const examSessionForm = props => {
  function validateDuplicateExamSession() {
    let duplicateFound = false;
    const examDate = this.parent.examDate;
    const language = this.parent.language;
    const level = this.parent.level;
    if (examDate && language && level) {
      duplicateFound = props.examSessionContent.examSessions.some(e => {
        return (
          e.session_date === examDate &&
          e.level_code === level &&
          e.language_code === language
        );
      });
    }
    return !duplicateFound;
  }

  const validationSchema = Yup.object().shape({
    language: Yup.string().required(props.t('examSession.language.required')),
    level: Yup.string().required(props.t('examSession.level.required')),
    examDate: Yup.string()
      .required(props.t('examSession.examDate.required'))
      .test(
        'duplicateExamSession',
        'Tutkintotilaisuus on jo olemassa',
        validateDuplicateExamSession,
      ),
    maxParticipants: Yup.number()
      .typeError('Pitää olla luku')
      .required(props.t('examSession.maxParticipants.required'))
      .positive()
      .integer(),
    address: Yup.string(),
    location: Yup.string(),
    extra: Yup.string(),
  });

  const RadioButtonComponent = ({
    field: { name, value, onChange },
    id,
    label,
    disabled,
  }) => {
    return (
      <RadioButton
        name={name}
        id={id}
        value={value}
        onChange={onChange}
        label={label}
        disabled={disabled}
      />
    );
  };

  const RadioButtonGroup = ({
    value,
    id,
    label,
    className,
    children,
    error,
  }) => {
    return (
      <div className={className} id={id}>
        <h3>{label}</h3>
        {children}
        {error && value ? (
          <span className={classes.ErrorMessage}>{error}</span>
        ) : null}
      </div>
    );
  };

  const languageFields = languages => {
    const uniqueLanguageCodes = R.compose(
      R.uniq,
      R.pluck('language_code'),
    );

    return uniqueLanguageCodes(languages).map(c => {
      return (
        <Field
          component={RadioButtonComponent}
          name="language"
          id={c}
          key={c}
          label={languageToString(c).toLowerCase()}
        />
      );
    });
  };

  const languageLevelFields = (languages, selectedLang) => {
    const allLevels = R.keys(CODE_TO_LEVEL);

    return allLevels.map(level => {
      const enabled = R.includes(
        { language_code: selectedLang, level_code: level },
        languages,
      );
      return (
        <Field
          component={RadioButtonComponent}
          name="level"
          id={level}
          key={level}
          label={CODE_TO_LEVEL[level]}
          disabled={!enabled}
        />
      );
    });
  };

  const examDateFields = (examDates, selectedLanguage) => {
    return examDates.map(examDate => {
      const enabled = R.includes(
        { language_code: selectedLanguage },
        examDate.languages,
      );
      return (
        <Field
          component={RadioButtonComponent}
          name="examDate"
          id={examDate.exam_date}
          key={examDate.exam_date}
          label={moment(examDate.exam_date).format(DATE_FORMAT)}
          disabled={!enabled}
        />
      );
    });
  };

  const registrationPediod = (examDates, selectedExamDate) => {
    if (selectedExamDate) {
      const examDate = examDates.find(e => e.exam_date === selectedExamDate);
      const start = moment(examDate.registration_start_date).format(
        DATE_FORMAT_WITHOUT_YEAR,
      );
      const end = moment(examDate.registration_end_date).format(DATE_FORMAT);
      return (
        <p>
          Ilmoittautumisaika {start} &ndash; {end}
        </p>
      );
    } else {
      return null;
    }
  };

  return (
    <Formik
      initialValues={{
        language: '',
        level: '',
        examDate: '',
        maxParticipants: '',
        address: '',
        location: '',
        extra: '',
      }}
      validationSchema={validationSchema}
      onSubmit={values => {
        const payload = {
          session_date: values.examDate,
          language_code: values.language,
          level_code: values.level,
          max_participants: Number.parseInt(values.maxParticipants),
          published_at: moment().toISOString(),
          location: [
            {
              name: 'TODO',
              address: values.address,
              other_location_info: values.location,
              extra_information: values.extra,
              lang: 'fi',
            },
          ],
        };
        props.onSubmit(payload);
      }}
      render={({ values, isValid, errors, touched }) => (
        <Form className={classes.Form}>
          <h1>Luo uusi tutkintotilaisuus</h1>
          <h2>Tutkintotilaisuuden tiedot</h2>
          <div data-cy="exam-session-form">
            <div className={classes.RadiobuttonGroup}>
              <RadioButtonGroup
                id="language"
                label={'Kieli *'}
                value={values.language}
                error={errors.language}
              >
                {languageFields(props.examSessionContent.organizer.languages)}
              </RadioButtonGroup>
            </div>
            <div className={classes.RadiobuttonGroup}>
              <RadioButtonGroup
                id="level"
                label={'Taso *'}
                value={values.level}
                error={errors.level}
              >
                {languageLevelFields(
                  props.examSessionContent.organizer.languages,
                  values.language,
                )}
              </RadioButtonGroup>
            </div>
            <div className={classes.RadiobuttonGroup}>
              <RadioButtonGroup
                id="examDate"
                label={'Ajankohta *'}
                value={values.examDate}
                error={errors.examDate}
              >
                {examDateFields(
                  props.examSessionContent.examDates,
                  values.language,
                  values.level,
                )}
              </RadioButtonGroup>
              {registrationPediod(
                props.examSessionContent.examDates,
                values.examDate,
              )}
              {/* <ErrorMessage
                name="examDate"
                component="span"
                className={classes.ErrorMessage}
            /> */}
            </div>
            <div className={classes.FormElement}>
              <h3>Osallistujapaikkojen määrä *</h3>
              <Field
                id="maxParticipants"
                name="maxParticipants"
                data-cy="input-max-participants"
                className={classes.MaxParticipantsInput}
              />
              <ErrorMessage
                name="maxParticipants"
                component="span"
                className={classes.ErrorMessage}
              />
            </div>
            <div className={classes.FormElement}>
              <h3>Osoite</h3>
              <Field
                id="address"
                name="address"
                placeholder="Järjestäjänkatu 3, 00100 Helsinki"
                className={classes.TextInput}
              />
              <ErrorMessage
                name="address"
                component="span"
                className={classes.ErrorMessage}
              />
            </div>
            <div className={classes.FormElement}>
              <h3>Tila</h3>
              <Field
                id="location"
                name="location"
                placeholder="Esim. auditorio A2"
                className={classes.TextInput}
              />
              <ErrorMessage
                name="location"
                component="span"
                className={classes.ErrorMessage}
              />
            </div>
            <div className={classes.FormElement}>
              <h3>Lisätiedot</h3>
              <Field
                component="textarea"
                id="extra"
                name="extra"
                rows={5}
                cols={33}
                maxLength="2048"
                wrap="soft"
                placeholder="Esim. ohjeistus testiin saapumiseksi"
                className={classes.TextArea}
              />
              <ErrorMessage
                name="extra"
                component="span"
                className={classes.ErrorMessage}
              />
            </div>
          </div>

          <Button type="submit" disabled={!isValid}>
            Tallenna tilaisuuden tiedot
          </Button>
        </Form>
      )}
    />
  );
};

examSessionForm.propTypes = {
  examSessionContent: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default withNamespaces()(examSessionForm);
