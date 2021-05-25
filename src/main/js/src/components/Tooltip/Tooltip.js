import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import InfoButton from '../../assets/svg/info.svg';
import classes from './Tooltip.module.css';

const Tooltip = props => {
  const { text } = props;
  const t = useTranslation();

  const [showToolTip, setShowToolTip] = useState(false);

  return (
    <div style={{ position: 'relative', width: '50%' }}>
      <button
        id="tooltip-trigger"
        aria-describedby="tooltip-trigger"
        aria-label={t('common.tooltip.ariaLabel')}
        role="tooltip"
        tabIndex={0}
        type="button"
        className={classes.Item}
        onTouchStart={() => setShowToolTip(!showToolTip)}
        onMouseEnter={() => setShowToolTip(true)}
        onKeyDown={e => {
          // Can be triggered with any key except 'Tab'
          if (e.key !== 'Tab') {
            e.preventDefault();
            setShowToolTip(!showToolTip);
          }
        }}
      >
        <img src={InfoButton} width={20} height={20} alt="info icon" />
      </button>
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
