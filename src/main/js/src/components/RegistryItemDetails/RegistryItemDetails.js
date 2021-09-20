import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import classes from './RegistryItemDetails.module.css';
import Hyperlink from '../UI/Hyperlink/Hyperlink';
import { getLanguagesWithLevelDescriptions } from '../../util/util';
import { DATE_FORMAT } from '../../common/Constants';
import { Link } from 'react-router-dom';
import * as i18nKeys from "../../common/LocalizationKeys";

const registryItemDetails = props => {
  const languages = (
    <div className={classes.Languages}>
      <h3>{props.t(i18nKeys.common_exam_languages)}</h3>
      {getLanguagesWithLevelDescriptions(props.item.languages).map(lang => {
        return <p key={lang}>{lang}</p>;
      })}
    </div>
  );

  const address = `${props.item.address.street}, ${props.item.address.zipCode
    } ${props.item.address.city}`;

  const contact = (
    <div className={classes.Contact}>
      <h3>{props.t(i18nKeys.registryItem_contact)}</h3>
      <p>{props.item.contact.name}</p>
      <Hyperlink type="phone" to={props.item.contact.phone} />
      <Hyperlink type="email" to={props.item.contact.email} />
      <p>{address}</p>
      <Hyperlink to={props.item.website} />
    </div>
  );

  const agreementPdf = props.item.attachmentId ? (
    <div>
      <a
        href={`/yki/api/virkailija/organizer/${props.item.oid}/file/${props.item.attachmentId
          }`}
        className={classes.PdfLink}
        download
      >
        {props.t(i18nKeys.registryItem_agreement_loadPdf)}
      </a>
    </div>
  ) : null;

  const agreement = (
    <div className={props.agreementActive ? null : classes.AgreementExpired}>
      <h3>{props.t(i18nKeys.common_agreement)}</h3>
      <p>
        {moment(props.item.agreement.start).format(DATE_FORMAT)} -{' '}
        {moment(props.item.agreement.end).format(DATE_FORMAT)}
      </p>
      {agreementPdf}
    </div>
  );

  const extra = (
    <div className={classes.Extra}>
      <h3>{props.t(i18nKeys.registryItem_extra)}</h3>
      <p>{props.item.extra}</p>
    </div>
  );

  const placeholder = "Tarkastele järjestäjän näkymää"

  const inspectExamSessions = (
    <div className={classes.InspectExamSessions} onClick={() => props.openSessions(props.item.oid)}>
      <p>{placeholder}</p>
    </div>
  );

  return (
    <div className={classes.RegistryItemDetails}>
      <div className={classes.Grid}>
        {languages}
        {contact}
        {agreement}
        {extra}
      </div>
      <Link
        to={{
          pathname: `/jarjestajarekisteri/${props.item.oid}/tutkintotilaisuudet`
        }}
        className={[classes.Grid, classes.LinkStyle].join(" ")}
      >
        {inspectExamSessions}
      </Link>
      <button className={[classes.Update, classes.LinkStyle].join(" ")} onClick={props.modify}>
        {props.t(i18nKeys.common_modify)}
      </button>
    </div>
  );
};

registryItemDetails.propTypes = {
  item: PropTypes.object.isRequired,
  modify: PropTypes.func.isRequired,
  openSessions: PropTypes.func.isRequired,
};

export default withTranslation()(registryItemDetails);
