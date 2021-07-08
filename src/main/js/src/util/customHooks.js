import { useSelector } from 'react-redux';

import {
  LANDSCAPE_WIDTH,
  MOBILE_WIDTH,
  TABLET_WIDTH,
} from '../common/Constants';

export const useMobileView = (mobile, tablet, landscape) => {
  const width = useSelector(state => state.yki.windowWidth);
  const isMobile = mobile && width <= MOBILE_WIDTH;
  const isTablet = tablet && width < TABLET_WIDTH;
  const isLandscapeWidth = landscape && width < LANDSCAPE_WIDTH;
  if (mobile && tablet) return isMobile || isTablet;
  if (landscape) return isLandscapeWidth;
  else if (tablet) return isTablet;

  return isMobile;
};
