import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import classes from './ExamDetailsPage.module.css';
import * as actions from '../../../store/actions/index';
import Header from '../../Header/Header';
import BackButton from '../BackButton/BackButton';

const examDetailsPage = ({ session, history, match, onfetchExamSession }) => {
  const [t] = useTranslation();

  useEffect(() => {
    if (!Object.keys(session).length) {
      onfetchExamSession(match.params.examSessionId);
    }
  });

  console.log(session);

  return (
    <div>
      <Header />
      <BackButton
        clicked={() => history.push(t('/valitse-tutkintotilaisuus'))}
      />
      <main className={classes.Content}>
        <p>{session.language_code}</p>
        <p>{session.level_code}</p>
      </main>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    session: state.registration.selectedExamSession,
    loading: state.registry.loading,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onfetchExamSession: examSessionId =>
      dispatch(actions.fetchExamSession(examSessionId)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(examDetailsPage);
