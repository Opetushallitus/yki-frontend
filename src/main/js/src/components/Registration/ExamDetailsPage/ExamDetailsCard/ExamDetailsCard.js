import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  DATE_FORMAT,
  ISO_DATE_FORMAT_SHORT,
} from '../../../../common/Constants';
import { evaluationTexts, getLanguageAndLevel } from '../../../../util/util';
import classes from './ExamDetailsCard.module.css';

const ExamDetailsCard = ({ exam, isFull, successHeader }) => {
  const [t, i18n] = useTranslation();

  const currentDate = moment().format(ISO_DATE_FORMAT_SHORT);
  const registrationClosed = moment(exam.registration_end_date).isBefore(
    currentDate,
  );

  const exceptionStatus = isFull ? (
    <p className={classes.Exception} data-cy={'exam-details-exception-status'}>
      {t('registration.examSpots.full')}
    </p>
  ) : !exam.open ? (
    <p className={classes.Exception} data-cy={'exam-details-exception-status'}>
      {t('registration.examSpots.notOpen')}
    </p>
  ) : null;

  const date = (
    <>
      <p>{t('common.examDate')}:</p>
      <p>{moment(exam.session_date).format(DATE_FORMAT)}</p>
    </>
  );

  const location =
    exam.location && exam.location.find(l => l.lang === i18n.language);
  const organizer = location ? <p>{`${location.name},`}</p> : null;
  const address = location ? (
    <p>{`${location.street_address}, ${location.zip} ${location.post_office}`}</p>
  ) : null;

  const locationDetails = (
    <>
      <p>{t('common.address')}:</p>
      <article>
        {organizer}
        <br /> {address}
      </article>
    </>
  );

  const extra =
    location && location.extra_information ? (
      <>
        <p>{t('registryItem.extra')}:</p>
        <p data-cy="exam-details-card-extra">{location.extra_information}</p>
      </>
    ) : null;

  const price = (
    <>
      <p>{`${t('registration.examDetails.card.price')}`}</p>
      <p>{exam.exam_fee || exam.amount || ''} €</p>
    </>
  );

  const registrationPeriod = (
    <>
      <p>{t('common.registration')}:</p>
      <p>{`${moment(exam.registration_start_date).format(
        DATE_FORMAT,
      )} - ${moment(exam.registration_end_date).format(DATE_FORMAT)}`}</p>
    </>
  );

  const availableSeats = (
    <>
      {!registrationClosed ? (
        <>
          <p>{t('registration.list.examSpots')}:</p>
          <p>{`${exam.max_participants - exam.participants} / ${
            exam.max_participants
          }`}</p>
        </>
      ) : exam.post_admission_active ? (
        <>
          <p>{t('registration.list.examSpots')}:</p>
          <p>{`${exam.post_admission_quota - exam.pa_participants} / ${
            exam.post_admission_quota
          }`}</p>
        </>
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
              <p>{t('registration.list.contact')}</p>
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
      <article>
        {organizer}
        {address}
      </article>
      {exam.subtests ? (
        <>
          {exam.subtests.map(s => {
            return <p>{t(evaluationTexts[s])}</p>;
          })}
          <p>{`${t('registration.examDetails.card.reeval.price')} ${
            exam.amount
          } €`}</p>
        </>
      ) : (
        <p>{`${t('registration.examDetails.card.price')} ${
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

ExamDetailsCard.propTypes = {
  exam: PropTypes.object.isRequired,
  isFull: PropTypes.bool.isRequired,
};

export default ExamDetailsCard;
