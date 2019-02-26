import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import moment from 'moment';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

import { DATE_FORMAT } from '../../../common/Constants';
import checkMarkDone from '../../../assets/svg/checkmark-done.svg';
import checkMarkNotDone from '../../../assets/svg/checkmark-not-done.svg';
import trashcan from '../../../assets/svg/trashcan.svg';
import classes from './ParticipantList.module.css';
import { ActionButton } from '../../UI/ActionButton/ActionButton';

export const participantList = props => {
  const registratioStatus = registrationState => {
    const image =
      registrationState === 'COMPLETED' ? checkMarkDone : checkMarkNotDone;
    const text =
      registrationState === 'COMPLETED'
        ? props.t('examSession.paid')
        : props.t('examSession.notPaid');
    return (
      <React.Fragment>
        <img src={image} alt="" /> {text}
      </React.Fragment>
    );
  };

  const ssnOrBirthDate = form => {
    return form.ssn ? form.ssn : moment(form.birthdate).format(DATE_FORMAT);
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
        <div
          className={[classes.ItemHeader, classes.Index].join(' ')}
          data-cy={`participant-${p.registration_id}`}
        >
          {i + 1}.
        </div>
        <div className={classes.ItemHeader}>
          {p.form.first_name} {p.form.last_name}
        </div>
        <div className={[classes.ItemHeader, classes.Status].join(' ')}>
          {registratioStatus(p.state)}
        </div>
        <div className={classes.Item}/>
        <div className={classes.Item}/>
        <div className={classes.Item}/>
        <div className={classes.Item}/>
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
        <div className={[classes.ShowOnHover].join(' ')}>
          <ActionButton
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
        </div>
        <span className={classes.Line} />
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

export default withTranslation()(participantList);
