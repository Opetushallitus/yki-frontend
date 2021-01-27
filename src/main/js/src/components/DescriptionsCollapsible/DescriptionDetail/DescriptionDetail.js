import React from 'react';

import classes from './DescriptionDetail.module.css'

const DescriptionDetail = (props) => {
  const { content } = props;

  const lineBreak = (index) => {
    if (index < content.length -1) {
      return <hr/>
    }
  }

  const levelBaseNumber = (level) => {
    switch (level.charAt(0)) {
      case 'A':
        return 1;
      case 'B':
        return 3;
      case 'C':
        return 5;
      default:
        return null;
    }
  }

  return (
     <div className={classes.DescriptionItem}>
       {content.map((item, i) => {
         const addition = levelBaseNumber(item.languageLevel);
         const headerNum = i + addition;

         return (
             <div key={i}>
               <div className={classes.RowItem}>
                 <div className={classes.LanguageLevel}>
                   <h3>{headerNum}</h3>
                   <hr />
                   <h3>{item.languageLevel}</h3>
                 </div>
                 <article>{item.descriptionText}</article>
               </div>
                {lineBreak(i)}
              </div>
         )
       })}
     </div>
  );
};

export default DescriptionDetail;