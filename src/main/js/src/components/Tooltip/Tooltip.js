import React, { useState } from 'react';

import classes from './Tooltip.module.css';

const Tooltip = props => {
  const { icon, triggerText, text } = props;

  const [showToolTip, setShowToolTip] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <div
        id="tooltip-trigger"
        aria-describedby="tooltip-trigger"
        role="tooltip"
        tabIndex={0}
        className={classes.Item}
        onTouchStart={() => setShowToolTip(!showToolTip)}
        onMouseEnter={() => setShowToolTip(true)}
        onKeyDown={() => setShowToolTip(!showToolTip)}
      >
        {icon ? (
          <image src={icon} width={20} height={20} />
        ) : (
          <div>{triggerText}</div>
        )}
      </div>
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
