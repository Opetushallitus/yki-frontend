import React from 'react';
import { Field } from 'formik';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import * as R from 'ramda';

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
    <React.Fragment>
      <h3>{props.t('registration.form.nationality')}</h3>
      <Field
        component="select"
        name="nationality"
        className={props.className}
        data-cy="select-nationality"
      >
        <option value="" key="" />
        {nationalityOptions}
      </Field>
    </React.Fragment>
  );
};

nationalitySelect.propTypes = {
  nationalities: PropTypes.array.isRequired,
  className: PropTypes.string.isRequired,
};

export default withTranslation()(nationalitySelect);
