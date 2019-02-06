import React from 'react';
import moment from 'moment';
import { withNamespaces } from 'react-i18next';
import PropTypes from 'prop-types';

import ExamSessionListItem from './ExamSessionListItem/ExamSessionListItem';

const examSessionList = props => {
  const list =
    Object.keys(props.examSessions).length !== 0 ? (
      <div>
        {Object.keys(props.examSessions).map(k => (
          <div key={k}>
            <p>
              {moment(k).format('DD.MM.YYYY')} {props.examSessions[k].length}{' '}
              {props.examSessions[k].length === 1
                ? props.t('common.examSessions.amount.single')
                : props.t('common.examSessions.amount')}
            </p>
            {props.examSessions[k].map(e => (
              <ExamSessionListItem key={e.published_at} examSession={e} />
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
  examSessions: PropTypes.object.isRequired,
};

export default withNamespaces()(examSessionList);
