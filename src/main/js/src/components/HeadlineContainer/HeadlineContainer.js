import React from 'react';
import PropTypes from 'prop-types';

import classes from './HeadlineContainer.module.css';
import {MOBILE_VIEW} from "../../common/Constants";
import {getDeviceOrientation} from "../../util/util";

/** HeadlineContainer takes props from parent:
 * headlineTitle as string, headlineContent as any/JSX element, headlineImage as string or object. */
/* @TODO: remove disableContent after exam details are sent from backend
     OR errorMessage is provided in PaymentStatus component
*/
const HeadlineContainer = (props) => {
  const {headlineTitle, headlineContent, headlineImage, disableContent} = props;

  const mobileLandscape = window.screen.availWidth < 768 && getDeviceOrientation() === 'landscape';

  return (
      <div className={classes.Headline}>
        <div className={classes.BaseContainer}>
          {MOBILE_VIEW || mobileLandscape ?
              <>
                <div className={classes.HeadlineText}
                     style={{background: `url(${headlineImage})`, backgroundSize: '100%'}}>
                  {disableContent ?
                      <h1 style={{paddingBottom: '0'}}>{headlineTitle}</h1>
                      :
                      <h1>{headlineTitle}</h1>
                  }
                </div>
                {disableContent ?
                    null
                    :
                    <div className={classes.HeadlineMobileContent}>
                      {headlineContent}
                    </div>
                }
              </>
              :
              <div className={classes.HeadlineText}>
                <h1>{headlineTitle}</h1>
                <hr/>
                {headlineContent}
              </div>
          }
        </div>
        {MOBILE_VIEW || mobileLandscape ?
            null
            :
            <div className={classes.BaseContainer}>
              <div className={classes.ImageContainer} aria-disabled>
                <img aria-disabled src={headlineImage} alt={'headline'}/>
              </div>
            </div>
        }
      </div>
  )
}

HeadlineContainer.propTypes = {
  headlineTitle: PropTypes.string.isRequired,
  headlineContent: PropTypes.element,
  headlineImage: PropTypes.string
};

export default HeadlineContainer;