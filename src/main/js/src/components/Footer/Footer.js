import React from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from 'react-redux';

import OPHFooterLogo from '../../assets/images/OPH_Su_Ru_vaaka_nega.png';
import classes from './Footer.module.css';
import * as i18nKeys from "../../common/LocalizationKeys";

const Footer = () => {
  const { t } = useTranslation();
  const store = useStore();

  const ykiHomePage = () => {
    const state = store.getState();
    const lang = state.yki.ykiLanguage;
    switch (lang) {
      case 'fi':
        return (
          <a
            href={
              'https://www.oph.fi/fi/koulutus-ja-tutkinnot/kieli-ja-kaantajatutkinnot/yleiset-kielitutkinnot-yki'
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            YKI Kotisivu{' '}
            <img
              src={require('../../assets/svg/external-link-white.svg')}
              alt={t(i18nKeys.common_newTab)}
            />
          </a>
        );
      case 'sv':
        return (
          <a
            href={'https://www.oph.fi/sv/allmanna-sprakexamina-yki'}
            target="_blank"
            rel="noopener noreferrer"
          >
            YKI Hemsida{' '}
            <img
              src={require('../../assets/svg/external-link-white.svg')}
              alt={t(i18nKeys.common_newTab)}
              style={{ color: 'white' }}
            />
          </a>
        );
      case 'en':
        return (
          <a
            href={
              'https://www.oph.fi/en/national-certificates-language-proficiency-yki'
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            YKI Homepage{' '}
            <img
              src={require('../../assets/svg/external-link-white.svg')}
              alt={t(i18nKeys.common_newTab)}
            />
          </a>
        );
      default:
        return (
          <a
            href={
              'https://www.oph.fi/fi/koulutus-ja-tutkinnot/kieli-ja-kaantajatutkinnot/yleiset-kielitutkinnot-yki'
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            YKI Kotisivu{' '}
            <img
              src={require('../../assets/svg/external-link-white.svg')}
              alt={t(i18nKeys.common_newTab)}
            />
          </a>
        );
    }
  };

  const accessibilityStatetment = () => {
    return (
      <a
        id="accessibility-statement-link"
        href={`/yki/saavutettavuus`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {t(i18nKeys.footer_yki_accessibility_link)}
        <img
          src={require('../../assets/svg/external-link-white.svg')}
          alt={t(i18nKeys.common_newTab)}
        />
      </a>
    );
  };

  return (
    <footer className={classes.Footer}>
      <div className={classes.FooterLinks}>
        <a href={'https://opintopolku.fi/'}>Opintopolku.fi</a>
        {ykiHomePage()}
        {accessibilityStatetment()}
        <div className={classes.AdditionalInfo}>
          <p>{t(i18nKeys.footer_yki_contact_info)}</p>
          <a
            href={'mailto:yki@oph.fi'}
            aria-label={`${t(i18nKeys.footer_yki_contact_info)} yki@oph.fi`}
          >
            yki@oph.fi
          </a>
          <p>{t(i18nKeys.footer_yki_additional_info)}</p>
        </div>
      </div>
      <div className={classes.FooterContact}>
        <p>
          {t(i18nKeys.common_oph_address)}
          <br />
          {t(i18nKeys.common_oph_zip)}
        </p>
        <p>
          {`${t(i18nKeys.common_phone)}`}{' '}
          <a
            href={'tel: +358 29 533 1000'}
            aria-label={`${t(i18nKeys.common_phone)} +358 29 533 1000`}
          >
            +358 29 533 1000
          </a>
          <br />
          {`${t(i18nKeys.common_fax)}`}{' '}
          <a
            href={'tel: +358 29 533 1035'}
            aria-label={`${t(i18nKeys.common_fax)} +358 29 533 1035`}
          >
            +358 29 533 1035
          </a>
        </p>
      </div>
      <div className={classes.FooterLogo}>
        <img src={OPHFooterLogo} alt={'OPH-logo'} />
      </div>
    </footer>
  );
};

export default Footer;
