import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { DATE_FORMAT } from '../../../../common/Constants';
import classes from './ExamDetailsCard.module.css';
import { examSessionParticipantsCount, isPostAdmissionActive } from "../../../../util/examSessionUtil";
import { evaluationTexts, getLanguageAndLevel } from '../../../../util/util';

const ExamDetailsCard = ({ exam, isFull, successHeader }) => {
  const [t, i18n] = useTranslation();

  const { participants, maxParticipants } = examSessionParticipantsCount(exam);

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
    <p>
      {t('common.testDay')}:{' '}
      <strong>{moment(exam.session_date).format(DATE_FORMAT)} </strong>
    </p>
  );

  const location =
    exam.location && exam.location.find(l => l.lang === i18n.language);
  const organizer = location && <span>{` ${location.name},`}</span>;
  const address = location && (
    <span>{` ${location.street_address}, \n`}<strong>{location.post_office.toUpperCase()}</strong></span>
  );

  const locationDetails = (
    <p>
      {t('common.testPlace')}:
      {organizer}
      {address}
    </p>
  );

  const extra = location && location.extra_information && (
    <p>
      {t('registryItem.extra')}:
      <strong data-cy="exam-details-card-extra">
        {''} {location.extra_information}
      </strong>
    </p>
  );

  const price = (
    <p>
      {`${t('registration.examDetails.card.price')}: `}
      <strong>{exam.exam_fee || exam.amount || ''} €</strong>
    </p>
  );

  const registrationPeriod = (
    <p>
      {t('common.registrationPeriod')}
      {': '}
      <strong>
        {`${moment(exam.registration_start_date).format(
          DATE_FORMAT,
        )} - ${moment(exam.registration_end_date).format(DATE_FORMAT)}`}
      </strong>
    </p>
  );

  const postAdmissionPeriodText = exam.post_admission_start_date === exam.post_admission_end_date
    ? moment(exam.post_admission_start_date).format(DATE_FORMAT)
    : `${moment(exam.post_admission_start_date).format(DATE_FORMAT)} - ${moment(exam.post_admission_end_date).format(DATE_FORMAT)}`;

  const postAdmissionPeriod = (
    <>
      {isPostAdmissionActive(exam) ? (
        <p>
          {t('examSession.postAdmission')}
          {': '}
          <strong>{postAdmissionPeriodText}</strong>
        </p>
      ) : null}
    </>
  )

  const availableSeats = (
    <p>
      {t('registration.list.examSpots')}
      {': '}
      <strong>
        {`${maxParticipants - participants} / ${maxParticipants}`}
      </strong>
    </p>
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
      <p>
        {organizer}
        {address}
      </p>
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
            {postAdmissionPeriod}
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
