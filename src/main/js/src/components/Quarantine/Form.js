import { FinnishSSN } from 'finnish-ssn';
import moment from 'moment';
import React, { useCallback, useState } from 'react';
import * as R from 'ramda';
import classes from './Quarantine.module.css';
import PropTypes from 'prop-types';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DatePicker from '../../components/UI/DatePicker/DatePicker';
import {
  LANGUAGES,
  DATE_FORMAT,
  DATE_FORMAT_PICKER,
} from '../../common/Constants';

const dateToString = date => date.format('YYYY-MM-DD');
const formatDate = date => moment(date).format(DATE_FORMAT);
const valueOrNull = R.when(R.isEmpty, R.always(null));

const QuarantineForm = props => {
  const { t, i18n, form, onEdit, onAdd, onCancel } = props;

  const initialBirthdate = form.birthdate ? formatDate(form.birthdate) : null;
  const initialStartDate = form.start_date ? formatDate(form.start_date) : null;
  const initialEndDate = form.end_date ? formatDate(form.end_date) : null;

  // Datepicker doesn't work with formik, so we store it in state instead
  const [birthdate, setBirthdate] = useState(initialBirthdate);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  const [ssn, setSsn] = useState('');

  const validateSsn = value => !value || FinnishSSN.validate(value);

  const today = moment(new Date()).format('YYYY-MM-DD');
  const cancelForm = e => {
    e.stopPropagation();
    e.preventDefault();
    onCancel();
  };

  const validationSchema = Yup.object().shape({
    first_name: Yup.string()
      .typeError(t('error.string'))
      .required(t('error.mandatory')),
    last_name: Yup.string()
      .typeError(t('error.string'))
      .required(t('error.mandatory')),
    diary_number: Yup.string()
      .typeError(t('error.string'))
      .required(t('error.mandatory')),
    ssn: Yup.string().test('invalid-ssn', t('error.ssn.invalid'), validateSsn),
  });

  const parsedBirthdate = birthdate
    ? dateToString(moment(birthdate, DATE_FORMAT))
    : null;
  const parsedStartDate = startDate
    ? dateToString(moment(startDate, DATE_FORMAT))
    : null;
  const parsedEndDate = endDate
    ? dateToString(moment(endDate, DATE_FORMAT))
    : null;

  const isBirthdateValid =
    !R.isNil(parsedBirthdate) && !R.isEmpty(parsedBirthdate);
  const isStartDateValid =
    !R.isNil(parsedStartDate) && !R.isEmpty(parsedStartDate);
  const isEndDateValid = !R.isNil(parsedEndDate) && !R.isEmpty(parsedEndDate);

  const noBirthdateOrSsn = (!birthdate || !isBirthdateValid) && (!ssn || !validateSsn(ssn));
  const getBirthdateError = useCallback(() => {
    const error = noBirthdateOrSsn
      ? t('error.birthdate.or.ssn.required')
      : null;
    return <span className={classes.ErrorMessage}>{error}</span>;
  }, [noBirthdateOrSsn, t]);

  const onFormSubmit = values => {
    // Datepicker uses different date format
    const payload = {
      ...values,
      email: valueOrNull(values.email),
      phone_number: valueOrNull(values.phone_number),
      first_name: valueOrNull(values.first_name),
      last_name: valueOrNull(values.last_name),
      diary_number: valueOrNull(values.diary_number),
      birthdate: parsedBirthdate,
      ssn: valueOrNull(ssn),
      start_date: parsedStartDate,
      end_date: parsedEndDate,
    };

    values.id ? onEdit(payload) : onAdd(payload);
  };

  const errorMsg = (
    <span className={classes.ErrorMessage}>{t('error.mandatory')}</span>
  );

  const setPickerBirthdate = dates => {
    // Datepicker sends SyntheticEvents when typing dates
    if (dates.constructor.name !== 'SyntheticEvent') {
      setBirthdate(moment(dates[0]).format(DATE_FORMAT));
    }
  };
  const setPickerStartDate = dates => {
    // Datepicker sends SyntheticEvents when typing dates
    if (dates.constructor.name !== 'SyntheticEvent') {
      setStartDate(moment(dates[0]).format(DATE_FORMAT));
    }
  };
  const setPickerEndDate = dates => {
    // Datepicker sends SyntheticEvents when typing dates
    if (dates.constructor.name !== 'SyntheticEvent') {
      setEndDate(moment(dates[0]).format(DATE_FORMAT));
    }
  };

  return (
    <Formik
      key={`quarantine-form-${form.id}`}
      initialValues={form}
      validationSchema={validationSchema}
      onSubmit={onFormSubmit}
      render={({ values, handleChange, isValid, dirty }) => (
        <Form>
          <div className={classes.QuarantineFormFields}>
            <h3>{t('participationBan.participantPersonalInformation')}</h3>
            <span />
            <span />

            <div className={classes.QuarantineFormField}>
              <label htmlFor="first_name">{t('common.first_name')}</label>
              <Field
                autoFocus={true}
                id="first_name"
                tabIndex="1"
                name="first_name"
              />
              <ErrorMessage
                name="first_name"
                component="span"
                className={classes.ErrorMessage}
              />
            </div>
            <div className={classes.QuarantineFormField}>
              <label htmlFor="last_name">{t('common.last_name')}</label>
              <Field id="last_name" tabIndex="2" name="last_name" />
              <ErrorMessage
                name="last_name"
                component="span"
                className={classes.ErrorMessage}
              />
            </div>
            <div className={classes.QuarantineFormField}>
              <label htmlFor="birthdate">{t('common.birthdate')}</label>
              <DatePicker
                options={{
                  defaultDate: birthdate,
                  value: birthdate,
                  maxDate: today,
                  allowInput: true,
                  dateFormat: DATE_FORMAT_PICKER,
                  noMinDateUpdate: true,
                }}
                autoComplete="off"
                tabIndex="3"
                locale={i18n.language}
                onChange={setPickerBirthdate}
                onBlur={event => setBirthdate(event.target.value)}
                id="birthdate"
                style={{ width: '100%' }}
              />
              {getBirthdateError()}
            </div>
            <div className={classes.QuarantineFormField}>
              <label htmlFor="ssn">{t('common.ssn')}</label>
              <input
                type="text"
                value={ssn}
                onChange={e => setSsn(e.target.value)}
              />
              {!validateSsn(ssn) && (
                <span className={classes.ErrorMessage}>
                  {t('error.ssn.invalid')}
                </span>
              )}
            </div>

            <div className={classes.QuarantineFormField}>
              <label htmlFor="email">{t('common.email')}</label>
              <Field name="email" tabIndex="5" id="email" />
            </div>
            <div className={classes.QuarantineFormField}>
              <label htmlFor="phone_number">{t('common.phoneNumber')}</label>
              <Field name="phone_number" tabIndex="6" id="phone_number" />
            </div>

            <h3>{t('participationBan.generalInformation')}</h3>
            <span />
            <span />

            <div className={classes.QuarantineFormField}>
              <label htmlFor="language_code">{t('common.examLanguage')}</label>
              <select
                value={values.language_code}
                name="language_code"
                onChange={handleChange}
                id="language_code"
                tabIndex="7"
              >
                {LANGUAGES.map(lang => (
                  <option key={`lang-option-${lang.code}`} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={classes.QuarantineFormField}>
              <label htmlFor="diary_number">{t('common.diaryNumber')}</label>
              <Field name="diary_number" tabIndex="8" id="diary_number" />
              <ErrorMessage
                name="diary_number"
                component="span"
                className={classes.ErrorMessage}
              />
            </div>
            <span />

            <div className={classes.QuarantineFormField}>
              <label htmlFor="start_date">
                {t('participationBan.startDate')}
              </label>
              <DatePicker
                options={{
                  defaultDate: startDate,
                  value: startDate,
                  allowInput: true,
                  dateFormat: DATE_FORMAT_PICKER,
                  noMinDateUpdate: true,
                }}
                autoComplete="off"
                tabIndex="9"
                id="start_date"
                locale={i18n.language}
                onChange={setPickerStartDate}
                onBlur={event => setStartDate(event.target.value)}
              />
              {!isStartDateValid && errorMsg}
            </div>
            <div className={classes.QuarantineFormField}>
              <label htmlFor="end_date">{t('participationBan.endDate')}</label>
              <DatePicker
                options={{
                  defaultDate: endDate,
                  value: endDate,
                  minDate: today,
                  allowInput: true,
                  dateFormat: DATE_FORMAT_PICKER,
                  noMinDateUpdate: true,
                }}
                autoComplete="off"
                tabIndex="10"
                id="end_date"
                locale={i18n.language}
                onChange={setPickerEndDate}
                onBlur={event => setEndDate(event.target.value)}
              />
              {!isEndDateValid && errorMsg}
            </div>
            <span />
          </div>

          <div className={classes.ConfirmButtons}>
            <button
              data-cy="submit-quarantine-btn"
              className={classes.ConfirmButton}
              type="submit"
              tabIndex="11"
              disabled={
                (dirty && !isValid) ||
                (!form.id && !isValid) ||
                noBirthdateOrSsn ||
                !isStartDateValid ||
                !isEndDateValid
              }
            >
              {t('common.send')}
            </button>
            <button
              className={classes.CancelButton}
              onClick={cancelForm}
              tabIndex="12"
            >
              {t('common.cancelConfirm')}
            </button>
          </div>
        </Form>
      )}
    />
  );
};

QuarantineForm.propTypes = {
  t: PropTypes.func.isRequired,
  i18n: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default QuarantineForm;
