import React from 'react';

import OPHLogo from '../../assets/svg/oph-logo-updated.svg';
import LanguageSelect from '../../containers/LanguageSelect/LanguageSelect';
import { useMobileView } from '../../util/customHooks';
import MobileMenu from '../MobileMenu/MobileMenu';
import classes from './Header.module.css';
import NavigationItems from './NavigationItems/NavigationItems';
import NavigationTabs from './NavigationTabs/NavigationTabs';

const header = props => {
  const { nav } = props;
  const isMobileOrTablet = useMobileView(true, true);
  return nav ? (
    <header className={classes.Header}>
      <nav>
        <NavigationItems />
      </nav>
    </header>
  ) : (
    <header className={classes.RegistrationHeader}>
      <img src={OPHLogo} alt={'OPH-Logo'} />
      {isMobileOrTablet ? (
        <MobileMenu />
      ) : (
        <>
          <div className={classes.HeaderTabsContainer}>
            <NavigationTabs />
          </div>
          <LanguageSelect />
        </>
      )}
    </header>
  );
};

export default header;
