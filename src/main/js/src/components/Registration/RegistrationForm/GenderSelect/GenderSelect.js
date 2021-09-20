import { Field } from 'formik';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import React from 'react';
import { withTranslation } from 'react-i18next';

import classes from '../RegistrationForm.module.css';
import * as i18nKeys from "../../../../common/LocalizationKeys";

export const genderSelect = props => {
  const sortByCode = R.sortBy(R.prop('koodiArvo'));
  const gendersByLocale = sortByCode(props.genders).map(g => {
    const metadata = g.metadata.find(
      m => m.kieli === props.i18n.language.toUpperCase(),
    );
    return (
      <option value={g.koodiArvo} key={g.koodiArvo}>
        {metadata.nimi}
      </option>
    );
  });

  return (
    <div className={classes.InputFieldWrapper}>
      <label htmlFor="gender-select">
        {props.t(i18nKeys.registration_form_gender)}
      </label>
      <Field
        id="gender-select"
        aria-required
        component="select"
        name="gender"
        className={props.className}
        data-cy="select-gender"
      >
        <option value="placeholder" key="placeholder">
          {props.t(i18nKeys.common_selectorDefault)}
        </option>
        {gendersByLocale}
      </Field>
    </div>
  );
};

genderSelect.propTypes = {
  genders: PropTypes.array.isRequired,
  className: PropTypes.string.isRequired,
};

export default withTranslation()(genderSelect);
