import React from 'react';
import { useTranslation } from 'react-i18next';

import YkiImage2 from '../../../assets/images/ophYki_image2.png';
import { DATE_FORMAT, MOBILE_VIEW } from '../../../common/Constants';
import {
  examLanguageAndLevel,
  formatDate,
} from '../../../util/examSessionUtil';
import HeadlineContainer from '../../HeadlineContainer/HeadlineContainer';
import classes from './ReEvaluationForm.module.css';

const session = {
  id: '1',
  exam_date: '2021-04-02',
  language_code: 'fin',
  level_code: 'KESKI',
  evaluation_start_date: '2021-04-01',
  evaluation_end_date: '2021-05-30',
  open: true,
};

const ReEvaluationForm = ({ history, match }) => {
  const examId = match.params.id;
  const { t } = useTranslation();
  const langAndLvl = examLanguageAndLevel(session);
  const examDate = formatDate(session, 'exam_date');

  return (
    <>
      <main className={classes.Container}>
        <HeadlineContainer
          headlineTitle={t('registration.reeval.title')}
          headlineContent={<p>{t('registration.reeval.text1')}</p>}
          headlineImage={YkiImage2}
        />
        <h2>{t('registration.reeval.formpage.title1')}</h2>
        <div>
          {langAndLvl}
          {examDate}
        </div>
        <h2>{t('registration.reeval.formpage.title2')}</h2>
        <p>{t('registration.reeval.formpage.text')}</p>
        <h2>{t('registration.reeval.formpage.title3')}</h2>
        <button
          role="link"
          className="YkiButton"
          style={{
            backgroundColor: 'hsla(194, 91%, 21%, 1)',
            padding: '0.25rem',
          }}
        >
          {t('registration.reeval.formpage.button')}
        </button>
      </main>
    </>
  );
};

export default ReEvaluationForm;
