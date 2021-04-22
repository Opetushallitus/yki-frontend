import React from 'react';

import classes from './TextAndButton.module.css';

const TextAndButton = props => {
  const { text1, text2, onClick, buttonLabel, active, elementKey } = props;

  const activeClass = active ? classes.Button : classes.ButtonInActive;
  return (
    <div
      className={classes.MainContainer}
      data-cy={`text-and-button-${elementKey}`}
    >
      <div className={classes.TextContainer}>
        <span>{text1}</span>
        {text2 && <span>{text2}</span>}
      </div>
      <button
        onClick={onClick}
        className={['YkiButton', activeClass].join(' ')}
      >
        {buttonLabel}
      </button>
    </div>
  );
};

export default TextAndButton;
