import React from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import PropTypes from 'prop-types';

import classes from './ExamDetailsCard.module.css';
import { languageToString, levelDescription } from '../../../../util/util';
import { DATE_FORMAT_WITHOUT_YEAR } from '../../../../common/Constants';

const examDetailsCard = ({ exam, isFull }) => {
  const [t, i18n] = useTranslation();

  const languageAndLevel = (
    <p>{`${languageToString(exam.language_code)}, ${levelDescription(
      exam.level_code,
    ).toLowerCase()}`}</p>
  );

  const date = (
    <p>{`${moment(exam.session_date).format(DATE_FORMAT_WITHOUT_YEAR)} ${t(
      'registration.examDetails.card.time',
    )} ? - ?`}</p>
  );

  const location =
    exam.location && exam.location.find(l => l.lang === i18n.language);
  const organizer = location ? <p>{`${location.name}`}</p> : null;
  const address = location ? <p>{`${location.address}`}</p> : null;

  const price = !isFull && (
    <p>{`${t('registration.examDetails.card.price')} ${
      exam.exam_fee ? exam.exam_fee : ''
    } €`}</p>
  );

  return (
    <div className={classes.Card} data-cy="exam-details-card">
      {languageAndLevel}
      {date}
      {organizer}
      {address}
      {price}
    </div>
  );
};

examDetailsCard.propTypes = {
  exam: PropTypes.object.isRequired,
  isFull: PropTypes.bool.isRequired,
};

export default examDetailsCard;
