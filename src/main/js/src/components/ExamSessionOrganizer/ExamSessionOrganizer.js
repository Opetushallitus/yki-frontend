import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';

import classes from './ExamSessionOrganizer.module.css';
import { collectRegistryItemDetails } from '../../util/registryUtil';
import { getLanguagesWithLevelDescriptions } from '../../util/util';
import { DATE_FORMAT } from '../../common/Constants';

export const examSessionOrganizer = props => {
  const item = collectRegistryItemDetails(
    props.organizer,
    props.organization,
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
      <h3>{props.t('registryItem.contactHeader')}</h3>
      <p>{item.contact.name}</p>
      <p>{item.contact.email}</p>
      <p>{item.contact.phone}</p>
      <p>{item.extra}</p>
    </div>
  );

  const agreement = (
    <div>
      <h3>{props.t('common.validityPeriod')}</h3>
      <p data-cy="exam-session-organizer-agreement-validity">
        {moment(item.agreement.start).format(DATE_FORMAT)} -{' '}
        {moment(item.agreement.end).format(DATE_FORMAT)}
      </p>
    </div>
  );

  return (
    <div
      className={classes.ExamSessionOrganizer}
      data-cy="exam-session-organizer-agreement"
    >
      <h2>{props.t('common.agreement')}</h2>
      <div className={classes.AgreementGrid}>
        {languages}
        {agreement}
      </div>
      <h2>{props.t('registryItem.contact')}</h2>
      <div>{contact}</div>
    </div>
  );
};

examSessionOrganizer.propTypes = {
  organizer: PropTypes.object.isRequired,
  organization: PropTypes.object.isRequired,
};

export default withNamespaces()(examSessionOrganizer);
