import 'react-phone-input-2/lib/style.css';

import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import { useSelector } from 'react-redux';

import classes from './PhoneNumberInput.module.css';

const PhoneNumberInput = ({
  onChange,
  current,
  nationalities,
  datacy,
  required,
}) => {
  const [localizations, setLocalizations] = useState(null);
  const state = useSelector(state => state);
  const lang = state.yki.ykiLanguage || 'fi';

  useEffect(() => {
    if (!nationalities && nationalities.length === 0) setLocalizations(null);
    else {
      const localizedCountries = nationalities.reduce((result, row) => {
        const metadata = row.metadata.find(m => m.kieli === lang.toUpperCase());
        return {
          ...result,
          [metadata.lyhytNimi.toLowerCase()]: metadata.nimi,
        };
      }, {});
      setLocalizations(localizedCountries);
    }
  }, [state.yki.ykiLanguage]);

  const numberOnChange = phone => onChange('+' + phone);

  return (
    <>
      {localizations && (
        <PhoneInput
          inputProps={{
            [`data-cy`]: datacy,
            required: required,
            [`aria-required`]: required,
          }}
          country={'fi'}
          onChange={numberOnChange}
          value={current}
          preferredCountries={['fi']}
          autoFormat={false}
          localization={localizations}
          containerClass={classes.PhoneNumberInput}
          inputClass={classes.TextInput}
          buttonClass={classes.DropdownButton}
        />
      )}
    </>
  );
};

PhoneNumberInput.propTypes = {
  name: PropTypes.string,
  current: PropTypes.string,
  datacy: PropTypes.string,
  onChange: PropTypes.func,
  setFieldValue: PropTypes.func,
  nationalities: PropTypes.array,
};

export default PhoneNumberInput;
