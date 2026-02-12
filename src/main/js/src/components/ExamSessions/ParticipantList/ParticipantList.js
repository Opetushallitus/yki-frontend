import { parsePhoneNumberFromString } from 'libphonenumber-js';
import moment from 'moment';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import checkMarkDone from '../../../assets/svg/checkmark-done.svg';
import checkMarkNotDone from '../../../assets/svg/checkmark-not-done.svg';
import trashcan from '../../../assets/svg/trashcan.svg';
import { DATE_FORMAT } from '../../../common/Constants';
import { ActionButton } from '../../UI/ActionButton/ActionButton';
import ListExport from './ListExport/ListExport';
import RelocateParticipant from './RelocateParticipant/RelocateParticipant';
import classes from './ParticipantList.module.css';
import { examSessionParticipantsCount } from '../../../util/examSessionUtil';
import * as actions from '../../../store/actions';

const stateComparator = () => (a, b) => {
  if (a.state === 'COMPLETED') return -1;
  if (b.state === 'COMPLETED') return 1;
  if (a.state === 'SUBMITTED') return -1;
  if (b.state === 'SUBMITTED') return 1;

  return 0;
};

const kindComparator = () => (a, b) => {
  if (a.kind === 'ADMISSION') return -1;
  if (b.kind === 'ADMISSION') return 1;
  if (a.kind === 'POST_ADMISSION') return -1;
  if (b.kind === 'POST_ADMISSION') return 1;

  return 0;
};

const fiCollator = new Intl.Collator('fi', { sensitivity: 'base' });
const namesComparator = () => (a, b) => {
  const lastNamesComparison = fiCollator.compare(a.last_name, b.last_name);
  if (lastNamesComparison < 0) {
    return -1;
  } else if (lastNamesComparison > 0) {
    return 1;
  }
  const firstNamesComparison = fiCollator.compare(a.first_name, b.first_name);
  if (firstNamesComparison < 0) {
    return -1;
  } else if (firstNamesComparison > 0) {
    return 1;
  }
  return 0;
};

export const participantList = props => {
  const [actionButtonsDisabled, setActionButtonsDisabled] = useState(false);
  const [displayingQueue, setDisplayingQueue] = useState(false);

  const [sortParticipantsFn, setSortParticipantsFn] = useState(() =>
    R.sortBy(R.prop('created')),
  );

  const getFreeRegistrationDescription = (source, basis, is_foreign) => {
    const t = key => props.t(`examSession.freeRegistration${key}`);
    return ` (${t('Source.' + source)}: ${is_foreign ? t('IsForeign') : ''}${t(
      'Basis.' + basis,
    )})`;
  };

  const getStateTranslation = (
    state,
    isAdmin,
    isFreeRegistration,
    freeRegistrationSource,
    freeRegistrationBasis,
    freeRegistrationIsForeign,
  ) => {
    switch (state) {
      case 'COMPLETED':
        if (isFreeRegistration) {
          return isAdmin
            ? `${props.t('examSession.free')} ${getFreeRegistrationDescription(
                freeRegistrationSource,
                freeRegistrationBasis,
                freeRegistrationIsForeign,
              )}`
            : props.t('examSession.free');
        }
        return props.t('examSession.paid');
      case 'CANCELLED':
        return props.t('examSession.cancelled');
      case 'EXPIRED':
        return props.t('examSession.expired');
      case 'PAID_AND_CANCELLED':
        if (isFreeRegistration) {
          return isAdmin
            ? `${props.t(
                'examSession.freeAndCancelled',
              )} ${getFreeRegistrationDescription(
                freeRegistrationSource,
                freeRegistrationBasis,
                freeRegistrationIsForeign,
              )}`
            : props.t('examSession.freeAndCancelled');
        }
        return props.t('examSession.paidAndCancelled');

      case 'TRANSFERED':
        if (isFreeRegistration) {
          return isAdmin
            ? `${props.t(
                'examSession.freeAndTransfered',
              )} ${getFreeRegistrationDescription(
                freeRegistrationSource,
                freeRegistrationBasis,
                freeRegistrationIsForeign,
              )}`
            : props.t('examSession.freeAndTransfered');
        }
        return props.t('examSession.paidAndTransfered');

      default:
        return props.t('examSession.notPaid');
    }
  };

  const registrationStatus = participant => {
    const registrationState = participant.state;
    const image =
      registrationState === 'COMPLETED' ? checkMarkDone : checkMarkNotDone;
    const registrationShownState =
      registrationState === 'COMPLETED' && participant.is_transfered
        ? 'TRANSFERED'
        : registrationState;
    const text = getStateTranslation(
      registrationShownState,
      props.user.isAdmin,
      participant.is_free_registration,
      participant.free_registration_source,
      participant.free_registration_basis,
      participant.free_registration_is_foreign,
    );

    return (
      <React.Fragment>
        <img src={image} data-cy={`registration-${registrationState}`} alt="" />{' '}
        {text}
      </React.Fragment>
    );
  };

  const ssnOrBirthDate = form => {
    return form.ssn ? form.ssn : moment(form.birthdate).format(DATE_FORMAT);
  };

  const getPhoneNumber = participant => {
    const supplied = participant.phone_number || '';
    let asNumber = parsePhoneNumberFromString(supplied);
    if (asNumber) {
      return asNumber.formatInternational();
    } else {
      // If phone number could not be parsed, try again with a default country code instead.
      asNumber = parsePhoneNumberFromString(supplied, 'FI');
      if (asNumber) {
        // Return parsed number without the country code, as our guess may be incorrect.
        return asNumber.formatNational(supplied);
      } else {
        // Otherwise, just return the string as is.
        return supplied;
      }
    }
  };

  const relocateParticipant = participant => {
    return (
      <RelocateParticipant
        examSession={props.examSession}
        examSessions={props.examSessions}
        onRelocate={newSessionId => {
          setActionButtonsDisabled(true);

          props.onRelocate(
            props.examSession.organizer_oid,
            props.examSession.id,
            participant.registration_id,
            newSessionId,
            props.isAdminView,
          );
        }}
        confirmText={props.t('examSession.registration.relocate.confirm')}
        buttonsDisabled={actionButtonsDisabled}
      />
    );
  };

  const handleSortChange = event => {
    switch (event.target.value) {
      case 'name':
        setSortParticipantsFn(() => R.sort(namesComparator()));
        break;
      case 'state':
        setSortParticipantsFn(() => R.sort(stateComparator()));
        break;
      case 'registrationTime':
        setSortParticipantsFn(() => R.sortBy(R.prop('created')));
        break;
      case 'registrationType':
        setSortParticipantsFn(() => R.sort(kindComparator()));
        break;
      default:
        setSortParticipantsFn(() => R.sortBy(R.prop('created')));
        break;
    }
  };

  const participantOrdering = () => {
    return (
      <>
        <label htmlFor="participantSort">
          {props.t('examSession.participants.sortBy')}
        </label>
        <select
          id="participantSort"
          className={classes.ParticipantSort}
          onChange={handleSortChange}
          defaultValue="registrationTime"
        >
          <option value="name">
            {props.t('examSession.participants.sortBy.name')}
          </option>
          <option value="registrationTime">
            {props.t('examSession.participants.sortBy.registrationTime')}
          </option>
          <option value="registrationType">
            {props.t('examSession.participants.sortBy.registrationType')}
          </option>
          <option value="state">
            {props.t('examSession.participants.sortBy.state')}
          </option>
        </select>
      </>
    );
  };

  const cancelRegistrationButton = p => {
    const cancelRegistration = (
      <React.Fragment>
        <img src={trashcan} alt="" />{' '}
        {props.t('examSession.registration.cancel')}
      </React.Fragment>
    );
    return (
      <ActionButton
        children={cancelRegistration}
        confirmOnRight={true}
        onClick={() => {
          setActionButtonsDisabled(true);

          props.onCancelRegistration(
            props.examSession.organizer_oid,
            props.examSession.id,
            p.registration_id,
            props.isAdminView,
          );
        }}
        confirmText={props.t('examSession.registration.cancel.confirm')}
        cancelText={props.t('examSession.registration.cancel.cancel')}
        buttonsDisabled={actionButtonsDisabled}
      />
    );
  };

  const participantRows = participants => {
    const renderCancelButton = p => {
      return (
        (props.user.isAdmin || props.user.isOrganizer) &&
        (p.state === 'SUBMITTED' || p.state === 'COMPLETED')
      );
    };

    return sortParticipantsFn(participants).map((p, i) => (
      <React.Fragment key={i}>
        <div
          className={[
            classes.ItemHeader,
            classes.Index,
            classes.StateItem,
          ].join(' ')}
          data-cy={`participant-${p.registration_id}`}
        >
          {i + 1}.
        </div>
        <div className={[classes.ItemHeader, classes.StateItem].join(' ')}>
          {p.last_name}, {p.first_name}
        </div>
        <div
          className={[
            classes.ItemHeader,
            p.state === 'COMPLETED' ? classes.StatusCompleted : classes.Status,
            classes.StateItem,
          ].join(' ')}
        >
          {registrationStatus(p)}
        </div>
        <div className={classes.StateItem}>
          {p.created && moment(p.created).format(DATE_FORMAT)}
        </div>
        <div className={classes.StateItem}>
          {p.kind === 'ADMISSION'
            ? props.t('examSession.registration')
            : p.kind === 'POST_ADMISSION'
            ? props.t('examSession.registration.postAdmission')
            : props.t('examSession.registration.queue')}
        </div>
        <div className={classes.StateItem}>
          {p.is_transferable && props.user.isAdmin
            ? relocateParticipant(p)
            : null}
        </div>
        <div className={classes.Item} />
        <div className={classes.Item}>{ssnOrBirthDate(p.form)}</div>
        <div className={classes.Item}>
          {p.street_address} {p.zip}
          {', '}
          {p.post_office}
        </div>
        <div className={classes.Item}>{getPhoneNumber(p)}</div>
        <div className={classes.Item}> {p.email}</div>
        <div className={classes.Item}>
          {renderCancelButton(p) ? cancelRegistrationButton(p) : null}
        </div>
        <span className={classes.Line} />
        <span className={classes.LineEnd} />
      </React.Fragment>
    ));
  };

  const participantsCount = examSessionParticipantsCount(props.examSession);
  const filteredParticipants = displayingQueue
    ? props.participants.filter(p => p.kind === 'QUEUE')
    : props.participants.filter(p => p.kind !== 'QUEUE');

  return (
    <div data-cy="participant-list">
      <div className={classes.Tabs} role="tablist">
        <button
          onClick={() => setDisplayingQueue(false)}
          role="tab"
          aria-selected={!displayingQueue}
          className={displayingQueue ? classes.NotSelected : classes.Selected}
        >
          <span>
            {props.t('examSession.participants')} (
            {participantsCount.participants}/{participantsCount.maxParticipants}
            )
          </span>
        </button>
        <button
          onClick={() => setDisplayingQueue(true)}
          role="tab"
          aria-selected={displayingQueue}
          className={displayingQueue ? classes.Selected : classes.NotSelected}
        >
          <span>
            {props.t('examSession.inQueue')} ({props.examSession.queue})
          </span>
        </button>
        <span />
      </div>
      {filteredParticipants.length > 0 && (
        <React.Fragment>
          <div className={classes.ListExport}>
            <ListExport
              participants={sortParticipantsFn(filteredParticipants)}
            />
            {participantOrdering()}
          </div>
          <div className={classes.ParticipantList}>
            {participantRows(filteredParticipants)}
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    onCancelRegistration: (
      organizerOid,
      examSessionId,
      registrationId,
      isAdminView,
    ) =>
      dispatch(
        actions.cancelRegistration(
          organizerOid,
          examSessionId,
          registrationId,
          isAdminView,
        ),
      ),
    onRelocate: (
      organizerOid,
      examSessionId,
      registrationId,
      toExamSessionId,
      isAdminView,
    ) =>
      dispatch(
        actions.relocateExamSession(
          organizerOid,
          examSessionId,
          registrationId,
          toExamSessionId,
          isAdminView,
        ),
      ),
  };
};

const mapStateToProps = state => {
  return {
    user: state.user.user,
  };
};

participantList.propTypes = {
  examSession: PropTypes.object.isRequired,
  examSessions: PropTypes.array.isRequired,
  participants: PropTypes.array.isRequired,
  onCancelRegistration: PropTypes.func.isRequired,
  onRelocate: PropTypes.func.isRequired,
  isAdminView: PropTypes.bool.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(participantList));
