import { T } from 'ramda';
import React from 'react';
import { useTranslation } from 'react-i18next';

import OPHLogo from '../../assets/svg/oph-logo-updated.svg';
import LanguageSelect from '../../containers/LanguageSelect/LanguageSelect';
import { useMobileView } from '../../util/customHooks';
import MobileMenu from '../MobileMenu/MobileMenu';
import classes from './Header.module.css';
import NavigationItems from './NavigationItems/NavigationItems';
import NavigationTabs from './NavigationTabs/NavigationTabs';

const header = props => {
  const { nav } = props;
  const { t } = useTranslation();

  const isMobileOrTablet = useMobileView(true, true);

  const skipToContentLink = (
    <a className={classes.SkipLink} href="#main">
      {t('common.skipToContent')}
    </a>
  );

  return nav ? (
    <header className={classes.Header}>
      {skipToContentLink}
      <nav>
        <NavigationItems />
      </nav>
    </header>
  ) : (
    <header className={classes.RegistrationHeader}>
      {skipToContentLink}
      <img src={OPHLogo} alt={'OPH-Logo'} />
      {isMobileOrTablet ? (
        <MobileMenu />
      ) : (
        <>
          {skipToContentLink}
          <nav className={classes.HeaderTabsContainer}>
            <NavigationTabs />
            <div style={{ marginLeft: 'auto' }}>
              <LanguageSelect />
            </div>
          </nav>
        </>
      )}
    </header>
  );
};

export default header;
