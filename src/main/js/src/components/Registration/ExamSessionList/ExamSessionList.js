import React from 'react';
import { withNamespaces } from 'react-i18next';
import PropTypes from 'prop-types';

import ExamSessionItem from '../ExamSessionItem/ExamSessionItem';

const examSessionList = props => {
  const list =
    Object.keys(props.examSessionsGroupedByDate).length !== 0 ? (
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
    ) : (
      <p>{props.t('registration.search.noResults')}</p>
    );
  return <React.Fragment>{list}</React.Fragment>;
};

examSessionList.propTypes = {
  examSessionsGroupedByDate: PropTypes.object.isRequired,
};

export default withNamespaces()(examSessionList);
