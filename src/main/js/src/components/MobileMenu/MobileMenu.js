import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import CloseSign from '../../assets/svg/close-sign-large.svg';
import MenuIcon from '../../assets/svg/menu.svg';
import NavigationTabs from '../Header/NavigationTabs/NavigationTabs';
import Collapsible from '../UI/Collapsible/Collapsible';
import classes from './MobileMenu.module.css';
import * as i18nKeys from "../../common/LocalizationKeys";

const MobileMenu = () => {
  const [isOpen, setCollapsibleOpen] = useState(false);
  const { t } = useTranslation();

  const CollapsibleMenu = () => {
    return (
      <>
        <Collapsible
          show={isOpen}
          clicked={() => setCollapsibleOpen(!isOpen)}
          extendedClassName={classes.MenuItems}
        >
          <div style={{ display: 'none' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <NavigationTabs
              isOpen={isOpen}
              setCollapsibleOpen={setCollapsibleOpen}
            />
            <hr />
          </div>
        </Collapsible>
      </>
    );
  };

  // enable/unable scrolling on document when mobile menu is open
  const scrollableBody = () => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  return (
    <>
      {scrollableBody()}
      <div
        tabIndex={0}
        role="button"
        aria-label={isOpen ? t(i18nKeys.common_nav_close) : t(i18nKeys.common_nav_open)}
        className={classes.MenuIcon}
        onClick={() => setCollapsibleOpen(!isOpen)}
        onKeyPress={() => setCollapsibleOpen(!isOpen)}
      >
        {isOpen ? (
          <img src={CloseSign} alt={t(i18nKeys.common_nav_close)} />
        ) : (
          <img src={MenuIcon} alt={t(i18nKeys.common_nav_open)} />
        )}
      </div>
      <CollapsibleMenu />
    </>
  );
};

export default MobileMenu;
