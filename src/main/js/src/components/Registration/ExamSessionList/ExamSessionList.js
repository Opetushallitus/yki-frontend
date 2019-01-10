import React from 'react';
import { withNamespaces } from 'react-i18next';

import classes from './ExamSessionList.module.css';
import { levelDescription } from '../../../util/util';

const ExamSessionList = props => {
  const languageSelect = (
    <label>
      {props.t('common.language')}
      <select className={classes.Select}>
        <option>{props.language.name}</option>
      </select>
    </label>
  );

  const levelSelect = (
    <label>
      {props.t('common.level')}
      <select className={classes.Select}>
        <option>{props.t(levelDescription(props.level))}</option>
      </select>
    </label>
  );

  const areaSelect = (
    <label>
      {props.t('common.area')}
      <select className={classes.Select}>
        <option>{props.t('common.area.all')}</option>
      </select>
    </label>
  );

  const filters = (
    <div className={classes.Filters}>
      {languageSelect}
      {levelSelect}
      {areaSelect}
    </div>
  );

  return <React.Fragment>{filters}</React.Fragment>;
};

export default withNamespaces()(ExamSessionList);
