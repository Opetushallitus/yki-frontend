import React from 'react';

import classes from './TextAndButton.module.css';

const TextAndButton = props => {
  const { text1, text2, onClick, buttonLabel } = props;
  return (
    <div className={classes.MainContainer}>
      <div className={classes.TextContainer}>
        <span>{text1}</span>
        {text2 && <span>{text2}</span>}
      </div>
      <button
        onClick={onClick}
        className={['YkiButton', classes.Button].join(' ')}
      >
        {buttonLabel}
      </button>
    </div>
  );
};

export default TextAndButton;
