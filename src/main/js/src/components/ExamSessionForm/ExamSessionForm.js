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
import { DATE_FORMAT, DATE_FORMAT_WITHOUT_YEAR } from '../../common/Constants';
import {
  languageToString,
  levelDescription,
  levelTranslations,
} from '../../util/util';
import { getLocalizedName } from '../../util/registryUtil';

const examSessionForm = props => {
  function validateDuplicateExamSession() {
    let duplicateFound = false;
    const examDate = this.parent.examDate;
    const language = this.parent.language;
    const level = this.parent.level;
    const officeOid = this.parent.officeOid;
    if (examDate && language && level) {
      duplicateFound = props.examSessionContent.examSessions.some(e => {
        return (
          e.session_date === examDate &&
          e.level_code === level &&
          e.language_code === language &&
          e.office_oid === officeOid
        );
      });
    }
    return !duplicateFound;
  }

  const validationSchema = Yup.object().shape({
    language: Yup.string().required(props.t('error.mandatory')),
    level: Yup.string().required(props.t('error.mandatory')),
    examDate: Yup.string()
      .required(props.t('error.mandatory'))
      .test(
        'duplicateExamSession',
        props.t('examSession.duplicate'),
        validateDuplicateExamSession,
      ),
    maxParticipants: Yup.number()
      .typeError(props.t('error.numeric'))
      .required(props.t('error.mandatory'))
      .positive()
      .integer(),
    address: Yup.string().required(props.t('error.mandatory')),
    location: Yup.string(),
    extra: Yup.string(),
  });

  const RadioButtonComponent = ({
    field: { name, value, onChange },
    id,
    label,
    extraLabel,
    disabled,
  }) => {
    return (
      <RadioButton
        name={name}
        id={id}
        value={value}
        onChange={onChange}
        label={label}
        extraLabel={extraLabel}
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
    const allLevels = R.keys(levelTranslations);

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
          label={levelDescription(level).toLowerCase()}
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
      const languages = examDate.languages
        .map(l => {
          return languageToString(l.language_code).toLowerCase();
        })
        .join(', ');
      return (
        <Field
          component={RadioButtonComponent}
          name="examDate"
          id={examDate.exam_date}
          key={examDate.exam_date}
          label={moment(examDate.exam_date).format(DATE_FORMAT)}
          extraLabel={languages}
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
          {props.t('common.registationPeriod')} {start} &ndash; {end}
        </p>
      );
    } else {
      return null;
    }
  };

  const organizationChildrenOptions = (children, lang) => {
    return children.map(c => {
      return (
        <option value={c.oid} key={c.oid}>
          {getLocalizedName(c.nimi, lang)}
        </option>
      );
    });
  };

  return (
    <Formik
      initialValues={{
        officeOid:
          props.examSessionContent.organizationChildren.length > 0
            ? props.examSessionContent.organizationChildren[0].oid
            : null,
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
        const office = values.officeOid
          ? props.examSessionContent.organizationChildren.find(
              o => o.oid === values.officeOid,
            )
          : null;
        const payload = {
          session_date: values.examDate,
          language_code: values.language,
          level_code: values.level,
          office_oid: values.officeOid,
          max_participants: Number.parseInt(values.maxParticipants),
          published_at: moment().toISOString(),
          location: [
            {
              name: getLocalizedName(
                office
                  ? office.nimi
                  : props.examSessionContent.organization.nimi,
                props.lng,
              ),
              address: values.address,
              other_location_info: values.location,
              extra_information: values.extra,
              lang: 'fi',
            },
          ],
        };
        props.onSubmit(payload);
      }}
      render={({ values, isValid, errors }) => (
        <Form className={classes.Form}>
          <h1>{props.t('examSession.add.header')}</h1>
          <h2>{props.t('examSession.add.subHeader')}</h2>
          <div data-cy="exam-session-form">
            {props.examSessionContent.organizationChildren.length > 0 ? (
              <div className={[classes.FormElement].join(' ')}>
                <h3>{`${props.t('examSession.office')} *`}</h3>
                <Field
                  component="select"
                  name="officeOid"
                  className={classes.Select}
                  data-cy="select-officeOid"
                >
                  {organizationChildrenOptions(
                    props.examSessionContent.organizationChildren,
                    props.lng,
                  )}
                </Field>
              </div>
            ) : null}
            <div className={classes.RadiobuttonGroup}>
              <RadioButtonGroup
                id="language"
                label={`${props.t('common.language')} *`}
                value={values.language}
                error={errors.language}
              >
                {languageFields(props.examSessionContent.organizer.languages)}
              </RadioButtonGroup>
            </div>
            <div className={classes.RadiobuttonGroup}>
              <RadioButtonGroup
                id="level"
                label={`${props.t('common.level')} *`}
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
                label={`${props.t('common.date')} *`}
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
            </div>
            <div className={classes.FormElement}>
              <h3>{`${props.t('examSession.maxParticipants')} *`}</h3>
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
              <h3>{`${props.t('common.address')} *`}</h3>
              <Field
                id="address"
                name="address"
                data-cy="input-address"
                placeholder={props.t('common.address.placeholder')}
                className={classes.TextInput}
              />
              <ErrorMessage
                name="address"
                component="span"
                className={classes.ErrorMessage}
              />
            </div>
            <div className={classes.FormElement}>
              <h3>{props.t('common.location')}</h3>
              <Field
                id="location"
                name="location"
                placeholder={props.t('common.location.placeholder')}
                className={classes.TextInput}
              />
              <ErrorMessage
                name="location"
                component="span"
                className={classes.ErrorMessage}
              />
            </div>
            <div className={classes.FormElement}>
              <h3>{props.t('common.extra')}</h3>
              <Field
                component="textarea"
                id="extra"
                name="extra"
                rows={5}
                cols={33}
                maxLength="2048"
                wrap="soft"
                placeholder={props.t('examSession.extra.placeholder')}
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
            {props.t('examSession.addButton')}
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
