import React from 'react';

import classes from './Header.module.css';
import NavigationItems from './NavigationItems/NavigationItems';
import LanguageSelect from '../../containers/LanguageSelect/LanguageSelect';

import OPHLogo from '../../assets/svg/oph-logo-updated.svg';

import NavigationTabs from "./NavigationTabs/NavigationTabs";
import MobileMenu from "../MobileMenu/MobileMenu";
import {MOBILE_VIEW, TABLET_VIEW} from "../../common/Constants";

const header = ({nav}) =>
    nav ? (
        <header className={classes.Header}>
          <nav>
            <NavigationItems/>
          </nav>
        </header>
    ) : (
        <header className={classes.RegistrationHeader}>
          <img src={OPHLogo} alt={'OPH-Logo'}/>
          {MOBILE_VIEW || TABLET_VIEW ?
              <MobileMenu />
              :
              <>
                <div className={classes.HeaderTabsContainer}>
                  <NavigationTabs/>
                </div>
                <LanguageSelect/>
              </>
          }
        </header>
    );

export default header;
