import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';

import { MOBILE_VIEW, TABLET_VIEW } from '../../../common/Constants';
import LanguageSelect from '../../../containers/LanguageSelect/LanguageSelect';
import classes from './NavigationTabs.module.css';

const NavigationTabs = props => {
  const [showLanguagesMenu, setLanguageMenuShow] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  const history = useHistory();

  const handleOnClick = () => {
    setLanguageMenuShow(!showLanguagesMenu);
  };

  const baseLinks = () => {
    const onDescriptionPage =
      location.pathname === '/' ||
      location.pathname === '/ilmoittautuminen' ||
      location.pathname === '/ilmoittautuminen/';

    const linkArray = [
      { title: 'common.registration.root', url: '/' },
      {
        title: 'common.registration',
        url: '/ilmoittautuminen/valitse-tutkintotilaisuus',
        secondary: '/ilmoittautuminen/',
      },
      { title: 'common.reeval', url: '/tarkistusarviointi' },
    ];

    const divider = onDescriptionPage && (MOBILE_VIEW || TABLET_VIEW);
    return (
      <>
        {linkArray.map((link, i) => {
          const isActive =
            location.pathname === link.url ||
            (link.secondary && location.pathname === link.secondary);
          return (
            <div
              key={link.title}
              className={isActive ? classes.ActiveTab : classes.InactiveTab}
            >
              <button
                className={classes.LinkButton}
                onClick={() => {
                  history.push(link.url);
                }}
                role="link"
              >
                {t(link.title)}
              </button>
            </div>
          );
        })}
        {divider ? <hr className={classes.Divider} /> : null}
      </>
    );
  };

  return (
    <>
      {showLanguagesMenu ? (
        <LanguageSelect
          isOpen={props.isOpen}
          setCollapsibleOpen={props.setCollapsibleOpen}
        />
      ) : (
        <>
          {baseLinks()}
          {MOBILE_VIEW || TABLET_VIEW ? (
            <div onClick={() => handleOnClick()}>
              <p className={classes.InactiveTab}>
                {t('common.registration.select.language')}
              </p>
            </div>
          ) : null}
        </>
      )}
    </>
  );
};

export default NavigationTabs;
