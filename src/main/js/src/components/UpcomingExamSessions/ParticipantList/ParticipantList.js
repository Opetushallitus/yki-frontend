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
import * as i18nKeys from "../../../common/LocalizationKeys";

const stateComparator = () => (a, b) => {
  if (a.state === 'COMPLETED') return -1;
  if (b.state === 'COMPLETED') return 1;
  if (a.state === 'SUBMITTED') return -1;
  if (b.state === 'SUBMITTED') return 1;

  return 0;
};

// const ResendEmailComponent = props => {
//   const [emailLang, setEmailLang] = useState("fi");
//   const [linkClicked, setLinkClicked] = useState(false);

//   const onResendClick = (participantName, participantEmail, regId, orgOid, examSessionId) => {
//     if(window.confirm(`Lähetetäänkö maksulinkki osallistujalle ${participantName} osoitteeseen ${participantEmail}`)){
//       props.onResendLink(
//         orgOid,
//         examSessionId,
//         regId,
//         emailLang
//       );
//       setLinkClicked(false);
//     }
//   }

//   const langSelection = () => {
//     return (
//       <>
//         <span className={classes.ResendEmailSelectionText}>Sähköpostin kieli: </span>
//         <select onChange={e => setEmailLang(e.target.value)}>
//           <option value="fi">{props.finText}</option>
//           <option value="sv">{props.svText}</option>
//           <option value="en">{props.enText}</option>
//         </select>
//         <button
//           className={classes.ResendEmailButton}
//           onClick={e => onResendClick(props.fullName, props.email, props.registrationId, props.organizerOid, props.examSessionId)}
//           data-cy="button-export-to-excel"
//         >
//           {props.sendText}
//         </button>

//       </>
//     );
//   }

//   return linkClicked ? langSelection() : (
//     // eslint-disable-next-line
//     <a
//       className={classes.ResendEmailLink}
//       href="javascript:void(0)" // eslint-disable-line
//       onClick={e => setLinkClicked(true)}
//     >
//       {props.linkText}
//     </a>
//   )
// }

export const participantList = props => {
  const [sortParticipantsFn, setSortParticipantsFn] = useState(
    R.sortBy(R.prop('created')),
  );

  const getStateTranslationKey = state => {
    switch (state) {
      case 'COMPLETED':
        return i18nKeys.examSession_paid;
      case 'CANCELLED':
        return i18nKeys.examSession_cancelled;
      case 'EXPIRED':
        return i18nKeys.examSession_expired;
      case 'PAID_AND_CANCELLED':
        return i18nKeys.examSession_paidAndCancelled;
      default:
        return i18nKeys.examSession_notPaid;
    }
  };

  const registratioStatus = participant => {
    const registrationState = participant.state;
    const image =
      registrationState === 'COMPLETED' ? checkMarkDone : checkMarkNotDone;
    const text = props.t(getStateTranslationKey(registrationState));

    // add ability to resend confirmation email if state is submitted
    // if (registrationState === 'SUBMITTED') {
    //   return (
    //     <React.Fragment>
    //       <img src={image} data-cy={`registration-${registrationState}`} alt="" />{' '}
    //       {`${text} `}
    //       {/* eslint-disable-next-line */}
    //       <ResendEmailComponent
    //         fullName={fullName}
    //         email={participant.form.email}
    //         registrationId={participant.registration_id}
    //         organizerOid={props.examSession.organizer_oid}
    //         examSessionId={props.examSession.id}
    //         onResendLink={props.onResendLink}
    //         sendText={props.t(i18nKeys.registration_notification_signup_button)}
    //         linkText={props.t(i18nKeys.examSession_participants_resendLink)}
    //         finText={props.t("common.language.fin")}
    //         svText={props.t("common.language.swe")}
    //         enText={props.t("common.language.eng")}
    //       />
    //   </React.Fragment>
    //   );
    // }
    // else just show status
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

  const confirmPaymentButton = participant => {
    const confirmPayment = (
      <React.Fragment>
        <img src={checkMarkDone} data-cy="confirm-payment-icon" alt="" />{' '}
        {props.t(i18nKeys.examSession_registration_confirmPayment)}
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
        confirmText={props.t(i18nKeys.examSession_registration_confirmPayment_confirm)}
        cancelText={props.t(i18nKeys.examSession_registration_confirmPayment_cancel)}
      />
    );
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
        confirmText={props.t(i18nKeys.examSession_registration_relocate_confirm)}
      />
    )
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
  };

  const participantFiltering = () => {
    return (
      <>
        <label htmlFor="participantFilter">
          {props.t(i18nKeys.examSession_participants_sortBy)}
        </label>
        <select
          id="ParticipantFilter"
          className={classes.ParticipantFilter}
          onChange={handleFilterChange}
        >
          <option value="registrationTime">
            {props.t(i18nKeys.examSession_participants_sortBy_registrationTime)}
          </option>
          <option value="registrationType">
            {props.t(i18nKeys.examSession_participants_sortBy_registrationType)}
          </option>
          <option value="name">
            {props.t(i18nKeys.examSession_participants_sortBy_name)}
          </option>
          <option value="state">
            {props.t(i18nKeys.examSession_participants_sortBy_state)}
          </option>
        </select>
      </>
    );
  };

  const cancelRegistrationButton = p => {
    const cancelRegistration = (
      <React.Fragment>
        <img src={trashcan} alt="" />{' '}
        {props.t(i18nKeys.examSession_registration_cancel)}
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
        confirmText={props.t(i18nKeys.examSession_registration_cancel_confirm)}
        cancelText={props.t(i18nKeys.examSession_registration_cancel_cancel)}
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
          {registratioStatus(p)}
        </div>
        <div className={classes.StateItem}>
          {p.created && moment(p.created).format(DATE_FORMAT)}
        </div>
        <div className={classes.StateItem}>
          {p.kind === 'ADMISSION'
            ? props.t(i18nKeys.examSession_registration)
            : props.t(i18nKeys.examSession_registration_postAdmission)}
        </div>
        <div className={classes.FirstShowOnHover}>
          {p.state === 'SUBMITTED' && !props.disableControls
            ? confirmPaymentButton(p)
            : p.state === 'COMPLETED' && !props.disableControls
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
    const post_admission_quota =
      props.examSession.post_admission_quota &&
        props.examSession.post_admission_active
        ? props.examSession.post_admission_quota
        : 0;
    return (
      <h2>
        {props.t(i18nKeys.examSession_participants)}
        {':'}{' '}
        {props.examSession.participants + props.examSession.pa_participants} /{' '}
        {props.examSession.max_participants + post_admission_quota}
      </h2>
    );
  };
  return (
    <div data-cy="participant-list">
      {participantsHeader()}

      {props.examSession.queue > 0 && (
        <h3>
          {props.t(i18nKeys.examSession_inQueue)}
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
