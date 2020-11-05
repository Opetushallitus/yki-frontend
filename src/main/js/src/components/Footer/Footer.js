import React from 'react';

import classes from './Footer.module.css';

import OPHFooterLogo from '../../assets/images/OPH_Su_Ru_vaaka_nega.png';
import {useTranslation} from "react-i18next";

const Footer = () => {
  const {t} = useTranslation();

  return (
      <footer className={classes.Footer}>
        <div className={classes.FooterLinks}>
          <a href={'https://opintopolku.fi/'}>Opintopolku.fi</a>
          <a href={'https://www.oph.fi'}>{t('common.oph.homepage')}</a>
          <a href={'https://www.facebook.com/opetushallitus'}>{t('common.oph.facebook')}</a>
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
