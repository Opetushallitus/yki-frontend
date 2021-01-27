import React from 'react';
import {useStore} from "react-redux";
import {useTranslation} from "react-i18next";
import OPHFooterLogo from '../../assets/images/OPH_Su_Ru_vaaka_nega.png';

import classes from './Footer.module.css';

const Footer = () => {
  const {t} = useTranslation();
  const store = useStore();

  const ykiHomePage = () => {
    const state = store.getState();
    const lang = state.yki.ykiLanguage;
    switch (lang) {
      case 'fi':
        return <a
          href={'https://www.oph.fi/fi/koulutus-ja-tutkinnot/kieli-ja-kaantajatutkinnot/yleiset-kielitutkinnot-yki'}
          target="_blank" rel="noopener noreferrer">YKI Kotisivu</a>
      case 'sv':
        return <a href={'https://www.oph.fi/sv/allmanna-sprakexamina-yki'} target="_blank" rel="noopener noreferrer">
          YKI Hemsida</a>
      case 'en':
        return <a href={'https://www.oph.fi/en/national-certificates-language-proficiency-yki'} target="_blank"
                  rel="noopener noreferrer">YKI Homepage</a>
      default:
        return <a
          href={'https://www.oph.fi/fi/koulutus-ja-tutkinnot/kieli-ja-kaantajatutkinnot/yleiset-kielitutkinnot-yki'}
          target="_blank" rel="noopener noreferrer">YKI Kotisivu</a>
    }
  }

  return (
    <footer className={classes.Footer}>
      <div className={classes.FooterLinks}>
        <a href={'https://opintopolku.fi/'}>Opintopolku.fi</a>
        {ykiHomePage()}
        <div className={classes.AdditionalInfo}>
          <p>{t('footer.yki.contact.info')}</p>
          <a href={'mailto:yki@oph.fi'}>yki@oph.fi</a>
          <p>{t('footer.yki.additional.info')}</p>
        </div>
      </div>
      <div className={classes.FooterContact}>
        <p>{t('common.oph.address')}
          <br/>
          {t('common.oph.zip')}</p>
        <p>{`${t('common.phone')}`}{' '}<a href={"tel: +358 29 533 1000"}>+358 29 533 1000</a>
          <br/>
          {`${t('common.fax')}`}{' '}<a href={"tel: +358 29 533 1035"}>+358 29 533 1035</a>
        </p>
      </div>
      <div className={classes.FooterLogo}>
        <img src={OPHFooterLogo} alt={'OPH-logo'}/>
      </div>
    </footer>
  )
};

export default Footer;
