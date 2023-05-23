import PropTypes from 'prop-types';
import React from 'react';

import { useMobileView } from '../../util/customHooks';
import classes from './HeadlineContainer.module.css';

/** HeadlineContainer takes props from parent:
 * headlineTitle as string, headlineContent as any/JSX element, headlineImage as string or object. */
/* @TODO: remove disableContent after exam details are sent from backend
     OR errorMessage is provided in PaymentStatus component
*/
const HeadlineContainer = props => {
  const {
    headlineTitle,
    headlineContent,
    headlineImage,
    disableContent,
    desktopBaseContainerCss,
  } = props;

  const mobile = useMobileView(true, false);
  const mobileLandscape = useMobileView(false, false, true);
  const isTablet = useMobileView(false, true);

  return (
    <div className={classes.Headline}>
      <div style={isTablet ? {} : desktopBaseContainerCss} className={classes.BaseContainer}>
        {mobile || mobileLandscape ? (
          <>
            <div
              className={classes.HeadlineText}
              style={{
                background: `url(${headlineImage})`,
                backgroundSize: '100%',
              }}
            >
              {disableContent ? (
                <h1 style={{ paddingBottom: '0' }}>{headlineTitle}</h1>
              ) : (
                <h1>{headlineTitle}</h1>
              )}
            </div>
            {disableContent ? null : (
              <div className={classes.HeadlineMobileContent}>
                {headlineContent}
              </div>
            )}
          </>
        ) : (
          <div className={classes.HeadlineText}>
            <h1 style={{ hyphens: 'maunal' }}>{headlineTitle}</h1>
            <hr />
            {headlineContent}
          </div>
        )}
      </div>
      {mobile || mobileLandscape ? null : (
        <div
          className={classes.BaseContainer}
          style={{
            background: `url(${headlineImage})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        ></div>
      )}
    </div>
  );
};

HeadlineContainer.propTypes = {
  headlineTitle: PropTypes.string.isRequired,
  headlineContent: PropTypes.element,
  headlineImage: PropTypes.string,
  desktopBaseContainerCss: PropTypes.object,
};

export default HeadlineContainer;
