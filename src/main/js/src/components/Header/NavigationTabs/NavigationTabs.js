import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useLocation } from 'react-router-dom';

import LanguageSelect from '../../../containers/LanguageSelect/LanguageSelect';
import { useMobileView } from '../../../util/customHooks';
import classes from './NavigationTabs.module.css';

const NavigationTabs = props => {
  const location = useLocation();
  const { t } = useTranslation();
  const history = useHistory();

  const isMobileOrTablet = useMobileView(true, true);

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
              <Link
                aria-current={isActive}
                className={classes.LinkButton}
                to={link.url}
                onKeyPress={() => {
                  history.push(link.url);
                }}
                role="link"
              >
                {t(link.title)}
              </Link>
            </div>
          );
        })}
      </>
    );
  };

  return (
    <>
      {!isMobileOrTablet ? (
        <>{baseLinks()}</>
      ) : (
        <div className={classes.ScrollableMenuWrapper}>
          <LanguageSelect
            isOpen={props.isOpen}
            setCollapsibleOpen={props.setCollapsibleOpen}
          />
          {baseLinks()}
        </div>
      )}
    </>
  );
};

export default NavigationTabs;
