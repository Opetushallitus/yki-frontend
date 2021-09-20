import React from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import Button from '../../UI/Button/Button';
import * as i18nKeys from "../../../common/LocalizationKeys";

const authButton = props => {
  const lang = (props && props.i18n && props.i18n.language) || 'fi';
  return (
    <form action={'/yki/auth/'}>
      <input type="hidden" name="examSessionId" value={props.examSessionId} />{' '}
      <input type="hidden" name="lang" value={lang} />{' '}
      <Button type="submit" isRegistration={true}>
        {props.t(i18nKeys.registration_auth_button)}
      </Button>
    </form>
  )
};

authButton.propTypes = {
  examSessionId: PropTypes.number.isRequired,
};

export default withTranslation()(authButton);
