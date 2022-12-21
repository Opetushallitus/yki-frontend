import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import * as R from 'ramda';
import { Formik, Form, Field, ErrorMessage } from 'formik';

import Button from '../../components/UI/Button/Button';
import DatePicker from '../../components/UI/DatePicker/DatePicker';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Page from '../../hoc/Page/Page';
import classes from './Quarantine.module.css';
import * as actions from '../../store/actions/index';
import { DATE_FORMAT, LANGUAGES } from '../../common/Constants';
import Modal from '../../components/UI/Modal/Modal';

const dateToString = date => date.format('YYYY-MM-DD');

const Quarantine = props => {
  const {
    t,
    i18n,
    quarantines,
    onFetchQuarantines,
    onAddNewQuarantine
  } = props;
  const findLang = (language) => LANGUAGES.find(l => l.code === language).name;

  useEffect(onFetchQuarantines, []);
  const [endDate, setEndDate] = useState(null);

  return (
    <Page>
      <div className={classes.QuarantineMatches}>
        <h1>
          Karenssit
        </h1>

        <p>
          Asetetut karenssit.
        </p>

        <Formik
          initialValues={{
            language_code: 'fin',
            email: '',
            birthdate: '',
            phone_number: '',
            first_name: '',
            last_name: '',
          }}
          onSubmit={onAddNewQuarantine}
          render={({ values, handleChange }) => (
            <Form>
              <label htmlFor="language_code">Tutkinnon kieli</label>
              <select
                value={values.language_code}
                name="language_code"
                onChange={handleChange}
              >
                <option value="swe">Ruotsi</option>
                <option value="fin">Suomi</option>
              </select>
              <br />
              <label htmlFor="email">Email</label>
              <Field name="email" />
              <br />
              <label htmlFor="birthdate">Syntymäaika</label>
              <Field name="birthdate" />
              <br />
              <label htmlFor="phone_number">Puhelinnumero</label>
              <Field name="phone_number" />
              <br />
              <label htmlFor="first_name">Etunimi</label>
              <Field name="first_name" />
              <br />
              <label htmlFor="last_name">Sukunimi</label>
              <Field name="last_name" />
              <br />
              <label htmlFor="end_date">Vanhenee</label>
              <DatePicker
                options={{ value: endDate ? dateToString(endDate) : '' }}
                locale={i18n.language}
                onChange={(dates) => {
                  setEndDate(moment(dates[0]));
                }}
                id="end_date"
              />

              <button type="submit" tabIndex="4">
                Lähetä
              </button>
            </Form>
        )}/>

        <div className={classes.QuarantineList}>
          <div className={classes.ListHeader}>
            {t('common.examLanguage')}
          </div>
          <div className={classes.ListHeader}>
            Vanhenee
          </div>
          <div className={classes.ListHeader}>
            {t('common.names')}
          </div>
          <div className={classes.ListHeader}>
            {t('common.email')}
          </div>
          <div className={classes.ListHeader}>
            {t('common.birthdate')}
          </div>
          <div className={classes.ListHeader}>
            {t('common.phoneNumber')}
          </div>
          <div className={classes.ListHeader}>
          </div>
          <div className={classes.ListHeader}>
          </div>
          {quarantines.map((match) => (
            <React.Fragment key={`quarantine-row-${match.id}`}>
              <div>{findLang(match.language_code)}</div>
              <div>{moment(match.end_date).format(DATE_FORMAT)}</div>
              <div>
                {match.name}
              </div>
              <div>
                {match.email}
              </div>
              <div>
                {moment(match.birthdate).format(DATE_FORMAT)}
              </div>
              <div>
                {match.phone_number}
              </div>
              <div>
              </div>
              <div>
              </div>
            </React.Fragment>
          ))}
        </div>
     </div>
    </Page>
  );
};

const mapStateToProps = state => {
  return {
    quarantines: state.quarantine.quarantines,
    confirm: state.quarantine.confirm,
    error: state.quarantine.error,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchQuarantines: () => {
      dispatch(actions.fetchQuarantines());
    },
    onAddNewQuarantine: (form) => {
      dispatch(actions.addNewQuarantine(form));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(withErrorHandler(Quarantine)));
