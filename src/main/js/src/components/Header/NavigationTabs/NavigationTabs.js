import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';

import LanguageSelect from '../../../containers/LanguageSelect/LanguageSelect';
import { useMobileView } from '../../../util/customHooks';
import classes from './NavigationTabs.module.css';

const NavigationTabs = props => {
  const [showLanguagesMenu, setLanguageMenuShow] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  const history = useHistory();

  const isMobileOrTablet = useMobileView(true, true);

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

    const divider = onDescriptionPage && isMobileOrTablet;
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
      {!isMobileOrTablet ? (
        <>
          {baseLinks()}
        </>
      ) : (
        <div className={classes.ScrollableMenuWrapper}>
          {baseLinks()}
          <div
            role="button"
            tabIndex={0}
            onClick={() => handleOnClick()}
            onKeyPress={() => handleOnClick()}
          >
            <p className={classes.InactiveTab}>
              {t('common.registration.select.language')}
            </p>
          </div>
          {showLanguagesMenu && (
            <LanguageSelect
              isOpen={props.isOpen}
              setCollapsibleOpen={props.setCollapsibleOpen}
            />
          )}
        </div>
      )}
    </>
  );
};

export default NavigationTabs;
