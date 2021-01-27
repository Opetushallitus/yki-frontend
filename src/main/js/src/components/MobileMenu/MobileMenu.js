import React, {useState} from 'react';

import MenuIcon from '../../assets/svg/menu.svg';
import CloseSign from '../../assets/svg/close-sign-large.svg';

import classes from './MobileMenu.module.css';
import Collapsible from "../UI/Collapsible/Collapsible";
import NavigationTabs from "../Header/NavigationTabs/NavigationTabs";

const MobileMenu = () => {
  const [isOpen, setCollapsibleOpen] = useState(false);

  const CollapsibleMenu = () => {
    return (
        <>
          <Collapsible
              show={isOpen}
              clicked={() => setCollapsibleOpen(!isOpen)}
              extendedClassName={classes.MenuItems}
          >
            <div style={{display: 'none'}}/>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <NavigationTabs isOpen={isOpen} setCollapsibleOpen={setCollapsibleOpen} />
              <hr />
            </div>
          </Collapsible>
        </>
    );
  };

  // enable/unable scrolling on document when mobile menu is open
  const scrollableBody = () => {
    if (isOpen) {
      document.body.style.overflow  = 'hidden';
    } else {
      document.body.style.overflow  = 'unset';
    }
  };

  return (
      <>
        {scrollableBody()}
        <div className={classes.MenuIcon} onClick={() => setCollapsibleOpen(!isOpen)}>
          {isOpen ? <img src={CloseSign} alt={'menu'}/> : <img src={MenuIcon} alt={'menu'}/>}
        </div>
        <CollapsibleMenu />
      </>
  );
}

export default MobileMenu;