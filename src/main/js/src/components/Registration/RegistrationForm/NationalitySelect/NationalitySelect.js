import { Field } from 'formik';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import React from 'react';
import { withTranslation } from 'react-i18next';

import classes from '../RegistrationForm.module.css';
import * as i18nKeys from "../../../../common/LocalizationKeys";

export const nationalitySelect = props => {
  const nationalitiesByLocale = props.nationalities.map(n => {
    const metadata = n.metadata.find(
      m => m.kieli === props.i18n.language.toUpperCase(),
    );
    return { name: metadata.nimi, code: n.koodiArvo };
  });
  const sortByName = R.sortBy(R.prop('name'));
  const nationalityOptions = sortByName(nationalitiesByLocale).map(n => {
    return (
      <option value={n.code} key={n.code}>
        {n.name}
      </option>
    );
  });

  return (
    <div className={classes.InputFieldWrapper}>
      <label htmlFor="select-nationality">
        {props.t(i18nKeys.registration_form_nationality)} *
      </label>
      <Field
        id="select-nationality"
        aria-required
        component="select"
        name="nationality"
        className={props.className}
        data-cy="select-nationality"
      >
        <option value="placeholder" key="">
          {props.t(i18nKeys.common_selectorDefault)}
        </option>
        {nationalityOptions}
      </Field>
    </div>
  );
};

nationalitySelect.propTypes = {
  nationalities: PropTypes.array.isRequired,
  className: PropTypes.string.isRequired,
};

export default withTranslation()(nationalitySelect);
