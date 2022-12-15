import React, { useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import Button from '../../components/UI/Button/Button';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Page from '../../hoc/Page/Page';
import classes from './Quarantine.module.css';
import * as actions from '../../store/actions/index';

const QuarantineMatches = props => {
  const { matches, onFetchQuarantineMatches, setQuarantine } = props;

  useEffect(() => {
    onFetchQuarantineMatches();
  }, []);

  const doSetQuarantine = () => {
    setQuarantine(1, 1);
  };

  return (
    <Page>
      <div className={classes.QuarantineMatches}>
        Karenssit
        <table>
          <tbody>
            {matches.map((match) => (
              <tr key={`quarantine-match-row-{match.id}`}>
                  <td>{match.birthdate}<br />{match.form.birthdate}</td>
                  <td>{match.email}</td>
                  <td><Button clicked={doSetQuarantine}>Lisää karenssi</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
     </div>
    </Page>
  );
};

const mapStateToProps = state => {
  return {
    matches: state.quarantine.matches
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchQuarantineMatches: () => {
      dispatch(actions.fetchQuarantineMatches());
    },
    setQuarantine: (id, reg_id) => {
      dispatch(actions.setQuarantine(id, reg_id));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(withErrorHandler(QuarantineMatches)));
