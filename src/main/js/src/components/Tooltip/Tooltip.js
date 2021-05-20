import React, { useState } from 'react';

import InfoButton from '../../assets/svg/info.svg'
import classes from './Tooltip.module.css';

const Tooltip = props => {
  const { text } = props;

  const [showToolTip, setShowToolTip] = useState(false);

  return (
    <div style={{ position: 'relative', width: '50%' }}>
      <img src={InfoButton}
        width={20}
        height={20}
        alt="info icon"
        id="tooltip-trigger"
        aria-describedby="tooltip-trigger"
        role="tooltip"
        tabIndex={0}
        className={classes.Item}
        onTouchStart={() => setShowToolTip(!showToolTip)}
        onMouseEnter={() => setShowToolTip(true)}
        onKeyDown={() => setShowToolTip(!showToolTip)} />
      <div
        className={[classes.ShowOnHover, classes.TooltipText].join('')}
        style={{ display: showToolTip ? 'flex' : 'none' }}
        aria-hidden={!showToolTip}
      >
        {text}
        <button
          className={classes.TooltipClose}
          onClick={e => {
            e.preventDefault();
            setShowToolTip(false);
          }}
          tabIndex={0}
          onKeyDown={() => setShowToolTip(false)}
        >
          x
        </button>
      </div>
    </div>
  );
};

export default Tooltip;
