import React from 'react';
import { withNamespaces } from 'react-i18next';
import PropTypes from 'prop-types';

import classes from './ExamSessionItem.module.css';

const examSessionItem = props => {
  const extraInfo = props.examSession.location[0].extra_information ? (
    <p>
      {props.t('common.extra')}:<br />
      {props.examSession.location[0].extra_information}
    </p>
  ) : null;

  const registerButton =
    props.examSession.participants !== props.examSession.max_participants ? (
      <button
        className={[classes.RegisterButton, classes.ButtonForSignup].join(' ')}
      >
        {props.t('registration.register')}
      </button>
    ) : (
      <button
        className={[classes.RegisterButton, classes.ButtonForQueue].join(' ')}
      >
        {props.t('registration.register.forQueue')}
      </button>
    );

  return (
    <div className={classes.ExamSessionItem} data-cy="exam-session-list-item">
      <p>{props.examSession.location[0].name}</p>
      <p>
        {props.examSession.participants}/{props.examSession.max_participants}
      </p>
      {extraInfo}
      {registerButton}
    </div>
  );
};

examSessionItem.propTypes = {
  examSession: PropTypes.object.isRequired,
};

export default withNamespaces()(examSessionItem);
