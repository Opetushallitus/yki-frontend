import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import moment from 'moment';

import classes from './ExamSessionDetails.module.css';
import {
  DATE_FORMAT,
  DATE_FORMAT_WITHOUT_YEAR,
} from '../../../common/Constants';
import { getLanguagesWithLevelDescriptions } from '../../../util/util';
import ParticipantList from './ParticipantList/ParticipantList';

export const examSessionDetails = props => {
  return (
    <div data-cy="exam-session-details">
      <h2>
        Tutkintotilaisuus:{' '}
        {getLanguagesWithLevelDescriptions([props.examSession])[0].toLowerCase()}
        {' '}
        {moment(props.examSession.session_date).format(
          DATE_FORMAT,
        )}
      </h2>
      <ParticipantList examSession={props.examSession}/>
    </div>
  );
};

examSessionDetails.propTypes = {
  examSession: PropTypes.object.isRequired,
};

export default withNamespaces()(examSessionDetails);
