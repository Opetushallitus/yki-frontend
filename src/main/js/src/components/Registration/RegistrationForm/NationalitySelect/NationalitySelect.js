import React from 'react';
import { Field } from 'formik';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import * as R from 'ramda';

import classes from './NationalitySelect.module.css';

export const nationalitySelect = props => {
  const localeNationalities = props.nationalities.map(n => {
    const metadata = n.metadata.find(m => m.kieli === props.lng.toUpperCase());
    return { name: metadata.nimi, code: n.koodiArvo };
  });
  const sortByName = R.sortBy(R.prop('name'));
  const nationalityOptions = sortByName(localeNationalities).map(n => {
    return (
      <option value={n.code} key={n.code}>
        {n.name}
      </option>
    );
  });

  return (
    <React.Fragment>
      <h3>{props.t('registration.form.nationality')}</h3>
      <Field
        component="select"
        name="nationality"
        className={classes.Select}
        data-cy="select-nationality"
      >
        {nationalityOptions}
      </Field>
    </React.Fragment>
  );
};

nationalitySelect.propTypes = {
  nationalities: PropTypes.array.isRequired,
};

export default withNamespaces()(nationalitySelect);
