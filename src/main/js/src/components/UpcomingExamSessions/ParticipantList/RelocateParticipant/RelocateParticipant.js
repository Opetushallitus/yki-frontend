import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { DATE_FORMAT } from '../../../../common/Constants';
import moment from 'moment';
import * as R from 'ramda';

import classes from './RelocateParticipant.module.css';
import * as i18nKeys from "../../../../common/LocalizationKeys";

export class RelocateParticipant extends Component {
  state = {
    selectedSession: null,
    confirming: false,
  };

  toggleConfirming = () => {
    this.setState(prevState => ({
      confirming: !prevState.confirming,
    }));
  };

  selectSession = session => {
    this.setState({
      selectedSession: session.target.value
    });
  }


  render() {
    const { t, examSession, examSessions } = this.props;
    const {
      language_code,
      level_code,
      session_date,
      office_oid,
      organizer_oid,
    } = examSession;

    const matchingOids = nextSession => {
      if (nextSession.organizer_oid === organizer_oid) {
        if (!nextSession.office_oid || !office_oid) return true;
        if (nextSession.office_oid === office_oid) return true;
      }
      return false;
    };

    const canBeRelocatedTo = e => {
      return (
        moment(e.session_date).isAfter(moment(session_date)) &&
        e.level_code === level_code &&
        e.language_code === language_code &&
        matchingOids(e) &&
        e.max_participants > e.participants
      );
    };

    const getValidSessions = R.compose(
      R.sortBy(R.prop('session_date')),
      R.filter(canBeRelocatedTo),
    );


    const relocateText = (
      <React.Fragment>
        {t(i18nKeys.examSession_registration_relocate)}
        {' '}
        {t(i18nKeys.examSession_registration_relocate_session)}
      </React.Fragment>
    );

    const selector = () => {
      const validSessions = getValidSessions(examSessions);

      return (
        <label>
          <select onChange={this.selectSession}>
            <option value={''}>Valitse</option>
            {validSessions && validSessions.length > 0 && validSessions.map(session => (
              <option key={session.fi} value={session.id}>
                {moment(session.session_date).format(DATE_FORMAT)}{' '}
              </option>
            ))}
          </select>
        </label>
      )
    }


    const confirmButton = () => {
      const disabled = !this.state.selectedSession;
      return (
        <button
          type="button"
          onClick={() => {
            this.state.selectedSession
              && this.props.onRelocate(parseInt(this.state.selectedSession))
          }}
          data-cy="button-confirm-action"
          className={[
            classes.ConfirmButton,
            disabled && classes.ConfirmButtonDisabled
          ].join(' ')}
          disabled={disabled}
        >
          {this.props.confirmText}
        </button>
      )
    };

    if (!examSessions || examSessions.length < 1) return null;

    return !this.state.confirming ? (
      <button
        type="button"
        onClick={this.toggleConfirming}
        data-cy="button-action"
        className={classes.Action}
      >
        {relocateText}
      </button>
    ) : <React.Fragment>
      {selector()}
      {confirmButton()}
    </React.Fragment>
  }
}

RelocateParticipant.propTypes = {
  examSession: PropTypes.object.isRequired,
  examSessions: PropTypes.array.isRequired,
  onRelocate: PropTypes.func.isRequired,
  confirmText: PropTypes.string.isRequired,
};

export default withTranslation()(RelocateParticipant);
