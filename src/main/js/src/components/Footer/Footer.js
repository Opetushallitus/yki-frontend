import React from 'react';
import { useTranslation } from 'react-i18next';

import OPHFooterLogo from '../../assets/images/OPH_Su_Ru_vaaka_nega.png';
import classes from './Footer.module.css';

const ExternalLink = ({ label, url }) => {
  const { t } = useTranslation();

  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      {label}{' '}
      <img
        src={require('../../assets/svg/external-link-white.svg')}
        alt={t('common.newTab')}
      />
    </a>
  );
};

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className={classes.Footer}>
      <div className={classes.FooterLinks}>
        {t('footer.yki.additionalInformation')}
        <ExternalLink
          url={t('footer.yki.homepage.url')}
          label={t('footer.yki.homepage.label')}
        />
        <ExternalLink
          url={t('common.yki.consent.url')}
          label={t('footer.yki.privacy.label')}
        />
        <ExternalLink
          url="/yki/saavutettavuus"
          label={t('footer.yki.accessibility.label')}
        />
      </div>
      <div className={classes.FooterContact}>
        <p>
          <b>{t('common.oph.name')}</b>
          <br />
          {t('common.oph.address')}
          <br />
          {t('common.oph.zip')}
        </p>
        <p>
          {`${t('common.phone')}`}{' '}
          <a
            href={`tel: ${t('common.oph.phone')}`}
            aria-label={`${t('common.phone')}: ${t('common.oph.phone')}`}
          >
            {t('common.oph.phone')}
          </a>
          <br />
          <a
            href={`mailto:${t('common.oph.yki.email')}`}
            aria-label={`${t('common.email')}: ${t(
              'common.oph.yki.email',
            )}`}
          >
            {t('common.oph.yki.email')}
          </a>
        </p>
        <p></p>
      </div>
      <div className={classes.FooterLogo}>
        <img src={OPHFooterLogo} alt={'OPH-logo'} />
      </div>
    </footer>
  );
};

export default Footer;
