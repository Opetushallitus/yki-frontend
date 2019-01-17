import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';
import moment from 'moment';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

import { DATE_FORMAT } from '../../../common/Constants';
import checkMarkDone from '../../../assets/svg/checkmark-done.svg';
import checkMarkNotDone from '../../../assets/svg/checkmark-not-done.svg';
import trashcan from '../../../assets/svg/trashcan.svg';
import classes from './ParticipantList.module.css';
import { DeleteButton } from '../../UI/DeleteButton/DeleteButton';

export const participantList = props => {
  const registratioStatus = state => {
    const image = state === 'COMPLETED' ? checkMarkDone : checkMarkNotDone;
    const text =
      state === 'COMPLETED'
        ? props.t('examSession.paid')
        : props.t('examSession.notPaid');
    return (
      <React.Fragment>
        <img src={image} alt="" /> {text}
      </React.Fragment>
    );
  };

  const ssnOrBirthDate = form => {
    return form.ssn ? form.ssn : moment(form.birth_date).format(DATE_FORMAT);
  };

  const cancelRegistration = () => {
    return (
      <React.Fragment>
        <img src={trashcan} alt="" />{' '}
        {props.t('examSession.registration.cancel')}
      </React.Fragment>
    );
  };

  const participantRows = participants => {
    return participants.map((p, i) => (
      <React.Fragment key={i}>
        <p
          className={[classes.ItemHeader, classes.Index].join(' ')}
          data-cy={`participant-${p.registration_id}`}
        >
          {i + 1}.
        </p>
        <p className={classes.ItemHeader}>
          {p.form.first_name} {p.form.last_name}
        </p>
        <p className={[classes.ItemHeader, classes.Status].join(' ')}>
          {registratioStatus(p.state)}
        </p>
        <p />
        <p />
        <p />
        <p />
        <p className={classes.Item}>{ssnOrBirthDate(p.form)}</p>
        <p className={classes.Item}>
          {p.form.street_address} {p.form.zip}
          {', '}
          {p.form.post_office}
        </p>
        <p>
          {parsePhoneNumberFromString(
            p.form.phone_number,
          ).formatInternational()}
        </p>
        <p>{p.form.email}</p>
        <p>
          <DeleteButton
            children={cancelRegistration()}
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
        </p>
        <span className={[classes.Line, classes.DesktopOnly].join(' ')}/>
        <span className={classes.LineEnd} />
      </React.Fragment>
    ));
  };

  return (
    <div data-cy="participant-list">
      <h3>
        {props.t('examSession.participants')}
        {':'} {props.participants.length} / {props.examSession.max_participants}
      </h3>
      <div className={classes.ParticipantList}>
        {participantRows(props.participants)}
      </div>
    </div>
  );
};

participantList.propTypes = {
  examSession: PropTypes.object.isRequired,
  participants: PropTypes.array.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default withNamespaces()(participantList);
