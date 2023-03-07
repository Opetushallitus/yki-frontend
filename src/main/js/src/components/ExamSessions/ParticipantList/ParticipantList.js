import { parsePhoneNumberFromString } from 'libphonenumber-js';
import moment from 'moment';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';

import checkMarkDone from '../../../assets/svg/checkmark-done.svg';
import checkMarkNotDone from '../../../assets/svg/checkmark-not-done.svg';
import trashcan from '../../../assets/svg/trashcan.svg';
import { DATE_FORMAT } from '../../../common/Constants';
import { ActionButton } from '../../UI/ActionButton/ActionButton';
import ListExport from './ListExport/ListExport';
import RelocateParticipant from './RelocateParticipant/RelocateParticipant';
import classes from './ParticipantList.module.css';
import { examSessionParticipantsCount } from '../../../util/examSessionUtil';

const stateComparator = () => (a, b) => {
  if (a.state === 'COMPLETED') return -1;
  if (b.state === 'COMPLETED') return 1;
  if (a.state === 'SUBMITTED') return -1;
  if (b.state === 'SUBMITTED') return 1;

  return 0;
};

const sortByNames = () => R.sortWith([
  R.ascend(R.path(['form', 'last_name'])),
  R.ascend(R.path(['form', 'first_name'])),
]);

export const participantList = props => {
  const [sortParticipantsFn, setSortParticipantsFn] = useState(sortByNames);

  const getStateTranslationKey = state => {
    switch (state) {
      case 'COMPLETED':
        return 'examSession.paid';
      case 'CANCELLED':
        return 'examSession.cancelled';
      case 'EXPIRED':
        return 'examSession.expired';
      case 'PAID_AND_CANCELLED':
        return 'examSession.paidAndCancelled';
      default:
        return 'examSession.notPaid';
    }
  };

  const registrationStatus = participant => {
    const registrationState = participant.state;
    const image =
      registrationState === 'COMPLETED' ? checkMarkDone : checkMarkNotDone;
    const text = props.t(getStateTranslationKey(registrationState));

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
    const asNumber = parsePhoneNumberFromString(participant.form.phone_number);
    return asNumber ? asNumber.formatInternational() : '';
  };

  const relocateParticipant = participant => {
    return (
      <RelocateParticipant
        examSession={props.examSession}
        examSessions={props.examSessions}
        onRelocate={newSessionId =>
          props.onRelocate(
            props.examSession.organizer_oid,
            props.examSession.id,
            participant.registration_id,
            newSessionId,
          )
        }
        confirmText={props.t('examSession.registration.relocate.confirm')}
      />
    );
  };

  const handleFilterChange = event => {
    switch (event.target.value) {
      case 'name':
        setSortParticipantsFn(sortByNames);
        break;
      case 'state':
        setSortParticipantsFn(() => R.sort(stateComparator()));
        break;
      case 'registrationTime':
        setSortParticipantsFn(() => R.sortBy(R.prop('created')));
        break;
      case 'registrationType':
        setSortParticipantsFn(() => R.sortBy(R.prop('kind')));
        break;
      default:
        setSortParticipantsFn(() => R.sortBy(R.prop('created')));
        break;
    }
  };

  const participantFiltering = () => {
    return (
      <>
        <label htmlFor="participantFilter">
          {props.t('examSession.participants.sortBy')}
        </label>
        <select
          id="ParticipantFilter"
          className={classes.ParticipantFilter}
          onChange={handleFilterChange}
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
        onClick={() =>
          props.onCancel(
            props.examSession.organizer_oid,
            props.examSession.id,
            p.registration_id,
          )
        }
        confirmText={props.t('examSession.registration.cancel.confirm')}
        cancelText={props.t('examSession.registration.cancel.cancel')}
      />
    );
  };

  const participantRows = participants => {
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
          {p.form.first_name} {p.form.last_name}
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
            : props.t('examSession.registration.postAdmission')}
        </div>
        <div className={classes.FirstShowOnHover}>
          {p.state === 'COMPLETED' && !props.disableControls
            ? relocateParticipant(p)
            : null}
        </div>
        <div className={classes.Item} />
        <div className={classes.Item}>{ssnOrBirthDate(p.form)}</div>
        <div className={classes.Item}>
          {p.form.street_address} {p.form.zip}
          {', '}
          {p.form.post_office}
        </div>
        <div className={classes.Item}>{getPhoneNumber(p)}</div>
        <div className={classes.Item}> {p.form.email}</div>
        <div className={classes.ShowOnHover}>
          {(p.state === 'SUBMITTED' || p.state === 'COMPLETED') &&
          !props.disableControls
            ? cancelRegistrationButton(p)
            : null}
        </div>
        <span className={classes.Line} />
        <span className={classes.LineEnd} />
      </React.Fragment>
    ));
  };

  const participantsHeader = () => {
    const participantsCount = examSessionParticipantsCount(props.examSession);
    return (
      <h2>
        {props.t('examSession.participants')}
        {':'} {participantsCount.participants} /{' '}
        {participantsCount.maxParticipants}
      </h2>
    );
  };
  return (
    <div data-cy="participant-list">
      {participantsHeader()}

      {props.examSession.queue > 0 && (
        <h3>
          {props.t('examSession.inQueue')}
          {':'} {props.examSession.queue}
        </h3>
      )}

      {props.participants.length > 0 && (
        <React.Fragment>
          <div className={classes.ListExport}>
            <ListExport participants={props.participants} />
            {participantFiltering()}
          </div>
          <div className={classes.ParticipantList}>
            {participantRows(props.participants)}
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

participantList.propTypes = {
  examSession: PropTypes.object.isRequired,
  examSessions: PropTypes.array.isRequired,
  participants: PropTypes.array.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirmPayment: PropTypes.func.isRequired,
  onRelocate: PropTypes.func.isRequired,
  onResendLink: PropTypes.func.isRequired,
  disableControls: PropTypes.bool,
};

export default withTranslation()(participantList);
