import React from 'react';
import { withNamespaces } from 'react-i18next';
import PropTypes from 'prop-types';

import Button from '../../UI/Button/Button';

const authButton = props => (
  <form action={'/yki/auth/'}>
    <input type="hidden" name="examSessionId" value={props.examSessionId} />{' '}
    <Button type="submit" isRegistration={true}>
      {props.t('registration.auth.button')}
    </Button>
  </form>
);

authButton.propTypes = {
  examSessionId: PropTypes.number.isRequired,
};

export default withNamespaces()(authButton);
