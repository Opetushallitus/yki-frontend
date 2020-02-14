import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import moment from 'moment';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import * as R from 'ramda';

import { DATE_FORMAT, REGISTRATION_KIND_POST_ADMISSION } from '../../../common/Constants';
import checkMarkDone from '../../../assets/svg/checkmark-done.svg';
import checkMarkNotDone from '../../../assets/svg/checkmark-not-done.svg';
import trashcan from '../../../assets/svg/trashcan.svg';
import classes from './ParticipantList.module.css';
import { ActionButton } from '../../UI/ActionButton/ActionButton';
import ListExport from './ListExport/ListExport';

const stateComparator = () => (a,b) => {
  if (a.state === 'COMPLETED')
    return -1;
  if (b.state === 'COMPLETED')
    return 1;
  if (a.state === "SUBMITTED")
    return -1;
  if(b.state === "SUBMITTED")
    return 1;

  return 0;
}

export const participantList = props => {
  const [sortParticipantsFn, setSortParticipantsFn] = useState(R.sort(stateComparator()));

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
  const registratioStatus = registrationState => {
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

  const confirmPaymentButton = participant => {
    const confirmPayment = (
      <React.Fragment>
        <img src={checkMarkDone} data-cy="confirm-payment-icon" alt="" />{' '}
        {props.t('examSession.registration.confirmPayment')}
      </React.Fragment>
    );

    return (
      <ActionButton
        children={confirmPayment}
        confirmOnRight={true}
        onClick={() =>
          props.onConfirmPayment(
            props.examSession.organizer_oid,
            props.examSession.id,
            participant.registration_id,
          )
        }
        confirmText={props.t('examSession.registration.confirmPayment.confirm')}
        cancelText={props.t('examSession.registration.confirmPayment.cancel')}
      />
    );
  };

  const relocateButton = participant => {
    const {
      language_code,
      level_code,
      session_date,
      office_oid,
    } = props.examSession;
    const canBeRelocatedTo = e => {
      return (
        moment(e.session_date).isAfter(moment(session_date)) &&
        e.level_code === level_code &&
        e.language_code === language_code &&
        e.office_oid === office_oid &&
        e.max_participants > e.participants
      );
    };
    const getNextSession = R.compose(
      R.head,
      R.sortBy(R.prop('session_date')),
      R.filter(canBeRelocatedTo),
    );

    const nextExamSession = getNextSession(props.examSessions);
    const relocate = (
      <React.Fragment>
        {props.t('examSession.registration.relocate')}{' '}
        {nextExamSession &&
          moment(nextExamSession.session_date).format(DATE_FORMAT)}{' '}
        {props.t('examSession.registration.relocate.session')}
      </React.Fragment>
    );
    return nextExamSession ? (
      <ActionButton
        children={relocate}
        confirmOnRight={true}
        onClick={() =>
          props.onRelocate(
            props.examSession.organizer_oid,
            props.examSession.id,
            participant.registration_id,
            nextExamSession.id,
          )
        }
        confirmText={props.t('examSession.registration.relocate.confirm')}
        cancelText={props.t('examSession.registration.relocate.cancel')}
      />
    ) : null;
  };

  const handleFilterChange = event => {
    switch (event.target.value) {
      case 'name': 
        setSortParticipantsFn(() => R.sortBy(R.path(['form', 'first_name'])));
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
  }

  const participantFiltering = () => {
    return (
      <>
        <label htmlFor="participantFilter">
          {props.t('examSession.participants.sortBy')}
        </label>
        <select id="ParticipantFilter" className={classes.ParticipantFilter} onChange={handleFilterChange}>
          <option value="registrationTime">{props.t('examSession.participants.sortBy.registrationTime')}</option>
          <option value="registrationType">{props.t('examSession.participants.sortBy.registrationType')}</option>
          <option value="name">{props.t('examSession.participants.sortBy.name')}</option>
          <option value="state">{props.t('examSession.participants.sortBy.state')}</option>
        </select>
      </>
    );
  }

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
          {registratioStatus(p.state)}
        </div>
        <div className={classes.StateItem}>
          {p.created && moment(p.created).format(DATE_FORMAT)}
        </div>
        <div className={classes.StateItem}>{p.kind === REGISTRATION_KIND_POST_ADMISSION ? props.t('examSession.postAdmission') : props.t('examSession.registration')}</div>
        <div className={classes.FirstShowOnHover}>
          {p.state === 'SUBMITTED'
            ? confirmPaymentButton(p)
            : p.state === 'COMPLETED'
            ? relocateButton(p)
            : null}
        </div>
        <div className={classes.Item} />
        <div className={classes.Item}>{ssnOrBirthDate(p.form)}</div>
        <div className={classes.Item}>
          {p.form.street_address} {p.form.zip}
          {', '}
          {p.form.post_office}
        </div>
        <div className={classes.Item}>
          {parsePhoneNumberFromString(
            p.form.phone_number,
          ).formatInternational()}
        </div>
        <div className={classes.Item}> {p.form.email}</div>
        <div className={classes.ShowOnHover}>
          {p.state === 'SUBMITTED' || p.state === 'COMPLETED'
            ? cancelRegistrationButton(p)
            : null}
        </div>
        <span className={classes.Line} />
        <span className={classes.LineEnd} />
      </React.Fragment>
    ));
  };

  return (
    <div data-cy="participant-list">
      <h2>
        {props.t('examSession.participants')}
        {':'} {props.examSession.participants} /{' '}
        {props.examSession.max_participants}
      </h2>
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
};

export default withTranslation()(participantList);
