import React from 'react';
import { Field } from 'formik';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import * as R from 'ramda';

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
    <React.Fragment>
      <h3>{props.t('registration.form.gender')}</h3>
      <Field
        component="select"
        name="gender"
        className={props.className}
        data-cy="select-gender"
      >
        <option value="" key="" />
        {gendersByLocale}
      </Field>
    </React.Fragment>
  );
};

genderSelect.propTypes = {
  genders: PropTypes.array.isRequired,
  className: PropTypes.string.isRequired,
};

export default withTranslation()(genderSelect);
