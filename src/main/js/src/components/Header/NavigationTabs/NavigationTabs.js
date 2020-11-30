import React, { useState } from 'react';
import { useLocation, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

import classes from "./NavigationTabs.module.css";
import LanguageSelect from "../../../containers/LanguageSelect/LanguageSelect";
import { MOBILE_VIEW, TABLET_VIEW } from "../../../common/Constants";

const NavigationTabs = (props) => {
  const [showLanguagesMenu, setLanguageMenuShow] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  const history = useHistory();

  const handleOnClick = () => {
    setLanguageMenuShow(!showLanguagesMenu);
  }

  const baseLinks = () => {
    const onDescriptionPage = location.pathname === '/'
      || location.pathname === '/ilmoittautuminen'
      || location.pathname === '/ilmoittautuminen/';

    const divider = (onDescriptionPage && (MOBILE_VIEW || TABLET_VIEW));
    return (
      <>
        <div className={onDescriptionPage ? classes.ActiveTab : classes.InactiveTab}>
          <button className={classes.LinkButton} onClick={() => history.push('/')} role="link">
            {t('common.registration.root')}
          </button>
        </div>
        <div className={onDescriptionPage ? classes.InactiveTab : classes.ActiveTab}>
          <button
            className={classes.LinkButton}
            onClick={() => history.push('/ilmoittautuminen/valitse-tutkintotilaisuus')}
            role="link"
          >
            {t('common.registration')}
          </button>
        </div>
        {divider ? <hr className={classes.Divider} /> : null}
      </>
    );
  };

  return (
    <>
      {showLanguagesMenu ?
        <LanguageSelect isOpen={props.isOpen} setCollapsibleOpen={props.setCollapsibleOpen} />
        :
        <>
          {baseLinks()}
          {MOBILE_VIEW || TABLET_VIEW ?
            <div onClick={() => handleOnClick()}>
              <p className={classes.InactiveTab}>{t('common.registration.select.language')}</p>
            </div>
            :
            null
          }
        </>
      }
    </>
  );
}

export default NavigationTabs;