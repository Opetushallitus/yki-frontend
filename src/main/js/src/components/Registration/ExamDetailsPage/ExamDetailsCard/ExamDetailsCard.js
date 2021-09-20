import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  DATE_FORMAT,
  ISO_DATE_FORMAT_SHORT,
} from '../../../../common/Constants';
import { evaluationTexts, getLanguageAndLevel } from '../../../../util/util';
import classes from './ExamDetailsCard.module.css';
import * as i18nKeys from "../../../../common/LocalizationKeys";

const ExamDetailsCard = ({ exam, isFull, successHeader }) => {
  const [t, i18n] = useTranslation();

  const currentDate = moment().format(ISO_DATE_FORMAT_SHORT);
  const registrationClosed = moment(exam.registration_end_date).isBefore(
    currentDate,
  );

  const exceptionStatus = isFull ? (
    <p className={classes.Exception} data-cy={'exam-details-exception-status'}>
      {t(i18nKeys.registration_examSpots_full)}
    </p>
  ) : !exam.open ? (
    <p className={classes.Exception} data-cy={'exam-details-exception-status'}>
      {t(i18nKeys.registration_examSpots_notOpen)}
    </p>
  ) : null;

  const date = (
    <p>
      {t(i18nKeys.common_examDate)}:{' '}
      <strong>{moment(exam.session_date).format(DATE_FORMAT)} </strong>
    </p>
  );

  const location =
    exam.location && exam.location.find(l => l.lang === i18n.language);
  const organizer = location && <span>{` ${location.name},`}</span>;
  const address = location && (
    <span>{` ${location.street_address}, \n${location.zip} ${location.post_office}`}</span>
  );

  const locationDetails = (
    <p>
      {t(i18nKeys.common_address)}:
      <strong>
        {organizer} {address}
      </strong>
    </p>
  );

  const extra = location && location.extra_information && (
    <p>
      {t(i18nKeys.registryItem_extra)}:
      <strong data-cy="exam-details-card-extra">
        {''} {location.extra_information}
      </strong>
    </p>
  );

  const price = (
    <p>
      {`${t(i18nKeys.registration_examDetails_card_price)}: `}
      <strong>{exam.exam_fee || exam.amount || ''} €</strong>
    </p>
  );

  const registrationPeriod = (
    <p>
      {t(i18nKeys.common_registration)}:
      <strong>
        {` ${moment(exam.registration_start_date).format(
          DATE_FORMAT,
        )} - ${moment(exam.registration_end_date).format(DATE_FORMAT)}`}
      </strong>
    </p>
  );

  const availableSeats = (
    <>
      {!registrationClosed ? (
        <p>
          {t(i18nKeys.registration_list_examSpots)}:
          <strong>
            {` ${exam.max_participants - exam.participants} / ${
              exam.max_participants
            }`}
          </strong>
        </p>
      ) : exam.post_admission_active ? (
        <p>
          {t(i18nKeys.registration_list_examSpots)}:
          <strong>
            {` ${exam.post_admission_quota - exam.pa_participants} / ${
              exam.post_admission_quota
            }`}
          </strong>
        </p>
      ) : null}
    </>
  );

  const contactDetails = (
    <>
      {exam.contact &&
        exam.contact.length > 0 &&
        exam.contact.map(c => {
          return (
            <>
              <p>{t(i18nKeys.registration_list_contact)}</p>
              <article>
                {c.name}
                <br /> {c.email}
                <br /> {c.phone_number}
              </article>
            </>
          );
        })}
    </>
  );

  const registrationSuccessContent = (
    <div data-cy="exam-details-card" className={classes.SuccessDetailsCard}>
      <p>{getLanguageAndLevel(exam)}</p>
      <p>{moment(exam.session_date).format(DATE_FORMAT)}</p>
      <p>
        {organizer}
        {address}
      </p>
      {exam.subtests ? (
        <>
          {exam.subtests.map(s => {
            return <p>{t(evaluationTexts[s])}</p>;
          })}
          <p>{`${t(i18nKeys.registration_examDetails_card_reeval_price)} ${
            exam.amount
          } €`}</p>
        </>
      ) : (
        <p>{`${t(i18nKeys.registration_examDetails_card_price)} ${
          exam.exam_fee
        } €`}</p>
      )}
      {contactDetails}
    </div>
  );

  return (
    <div data-cy="exam-details-card" className={classes.DetailsContainer}>
      {successHeader ? (
        registrationSuccessContent
      ) : (
        <>
          {exceptionStatus}
          <div className={classes.DetailsCard}>
            {date}
            {registrationPeriod}
            {locationDetails}
            {extra}
            {exam.subtests &&
              exam.subtests.map(s => {
                return <p>{t(evaluationTexts[s])}</p>;
              })}
            {price}
            {availableSeats}
            {contactDetails}
          </div>
        </>
      )}
    </div>
  );
};

export default ExamDetailsCard;
