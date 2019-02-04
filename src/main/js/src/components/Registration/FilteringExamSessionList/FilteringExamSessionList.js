import React from 'react';
import { withNamespaces } from 'react-i18next';
import PropTypes from 'prop-types';

import ExamSessionItem from '../ExamSessionItem/ExamSessionItem';

const filteringExamSessionList = props => {
  return (
    <div>
      {Object.keys(props.examSessionsGroupedByDate).map(k => (
        <div key={k}>
          <p>
            {k} {props.examSessionsGroupedByDate[k].length}{' '}
            {props.examSessionsGroupedByDate[k].length === 1
              ? props.t('common.examSessions.amount.single')
              : props.t('common.examSessions.amount')}
          </p>
          {props.examSessionsGroupedByDate[k].map(e => (
            <ExamSessionItem key={e.published_at} examSession={e} />
          ))}
        </div>
      ))}
    </div>
  );
};

filteringExamSessionList.propTypes = {
  examSessionsGroupedByDate: PropTypes.object.isRequired,
  language: PropTypes.string.isRequired,
  level: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
};

export default withNamespaces()(filteringExamSessionList);
