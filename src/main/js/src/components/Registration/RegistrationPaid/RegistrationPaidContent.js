import React from 'react';
import { withTranslation } from 'react-i18next';

import { ExternalLink } from "../../ExternalLink/ExternalLink";
import PropTypes from "prop-types";

export const RegistrationPaidContent = props => {

  return (
    <>
      <p>{props.t('registration.paid.text1')}</p>
      <p>{props.t('registration.paid.text2')}</p>
      <p>
        {props.t('registration.paid.text3')}{': '}
        <ExternalLink
          label={props.t('registration.form.consent.ophLink.label')}
          url={props.t('registration.form.consent.ophLink.url')}
        />
      </p>
      <p>
        {props.t('registration.paid.text4')}{': '}
        <ExternalLink
          label={props.t('registration.paid.text4.link.text')}
          url={props.t('registration.paid.text4.link.url')}
        />
      </p>
    </>
  );
}

RegistrationPaidContent.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withTranslation()(RegistrationPaidContent);
