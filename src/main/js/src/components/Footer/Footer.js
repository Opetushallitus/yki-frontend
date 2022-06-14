import React from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from 'react-redux';

import OPHFooterLogo from '../../assets/images/OPH_Su_Ru_vaaka_nega.png';
import classes from './Footer.module.css';

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
              alt={t('common.newTab')}
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
              alt={t('common.newTab')}
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
              alt={t('common.newTab')}
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
              alt={t('common.newTab')}
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
        {t('footer.yki.accessibility.link')}
        <img
          src={require('../../assets/svg/external-link-white.svg')}
          alt={t('common.newTab')}
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
          <p>{t('footer.yki.contact.info')}</p>
          <a
            href={'mailto:kielitutkinnot@oph.fi'}
            aria-label={`${t('footer.yki.contact.info')} kielitutkinnot@oph.fi`}
          >
            kielitutkinnot@oph.fi
          </a>
          <p>{t('footer.yki.additional.info')}</p>
        </div>
      </div>
      <div className={classes.FooterContact}>
        <p>
          {t('common.oph.address')}
          <br />
          {t('common.oph.zip')}
        </p>
        <p>
          {`${t('common.phone')}`}{' '}
          <a
            href={'tel: +358 29 533 1000'}
            aria-label={`${t('common.phone')} +358 29 533 1000`}
          >
            +358 29 533 1000
          </a>
          <br />
          {`${t('common.fax')}`}{' '}
          <a
            href={'tel: +358 29 533 1035'}
            aria-label={`${t('common.fax')} +358 29 533 1035`}
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
