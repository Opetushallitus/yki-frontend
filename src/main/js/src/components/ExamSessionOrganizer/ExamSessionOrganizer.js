import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';

import classes from './ExamSessionOrganizer.module.css';
import { collectRegistryItemDetails } from '../../util/registryUtil';
import { getLanguagesWithLevelDescriptions } from '../../util/registryUtil';
import { DATE_FORMAT } from '../../common/Constants';

const examSessionOrganizer = props => {
  const item = collectRegistryItemDetails(
    props.examSessionContent.organizer,
    props.examSessionContent.organization,
    props.lng,
  );

  const languages = (
    <div className={classes.Languages}>
      <h3>{props.t('common.exam.languages')}</h3>
      {getLanguagesWithLevelDescriptions(item.languages).map(lang => {
        return <p key={lang}>{lang.toLowerCase()}</p>;
      })}
    </div>
  );

  const contact = (
    <div className={classes.Contact}>
      <h3>Yhteyshenkilön tiedot</h3>
      <p>{item.contact.name}</p>
      <p>{item.contact.email}</p>
      <p>{item.contact.phone}</p>
      <p>{item.extra}</p>
    </div>
  );

  const agreement = (
    <div>
      <h3>Voimassaoloaika</h3>
      <p data-cy="exam-session-organizer-agreement-validity">
        {moment(item.agreement.start).format(DATE_FORMAT)} -{' '}
        {moment(item.agreement.end).format(DATE_FORMAT)}
      </p>
    </div>
  );

  return (
    <div className={classes.ExamSessionOrganizer} data-cy="exam-session-organizer-agreement">
      <h2>Voimassa olevat järjestäjäsopimukset</h2>
      <div className={classes.AgreementGrid}>
        {languages}
        {agreement}
      </div>
      <h2>Yhteystiedot</h2>
      <div>{contact}</div>
      <button className={classes.Update} onClick={props.clicked}>
        Muuta yhteystietoja
      </button>
    </div>
  );
};

examSessionOrganizer.propTypes = {
  examSessionContent: PropTypes.object.isRequired,
};

export default withNamespaces()(examSessionOrganizer);
