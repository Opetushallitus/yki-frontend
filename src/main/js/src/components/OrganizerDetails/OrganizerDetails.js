import React from 'react';

import classes from './OrganizerDetails.module.css';
import Hyperlink from '../UI/Hyperlink/Hyperlink';

const organizerDetails = props => {
  const languages = (
    <div className={classes.Languages}>
      <h3>Kielitutkinnot</h3>
      {props.organizer.languages.map(lang => {
        return <p key={lang}>{lang}</p>;
      })}
    </div>
  );

  const address = `${props.organizer.address.street}, ${
    props.organizer.address.zipCode
  } ${props.organizer.address.city}`;

  const contact = (
    <div className={classes.Contact}>
      <h3>Yhteystiedot</h3>
      <p>{props.organizer.contact.name}</p>
      <Hyperlink type="phone" to={props.organizer.contact.phone} />
      <Hyperlink type="email" to={props.organizer.contact.email} />
      <p>{address}</p>
      <Hyperlink to={props.organizer.website} />
    </div>
  );

  const agreement = (
    <div className={classes.Agreement}>
      <h3>Sopimuskausi</h3>
      <p>
        {props.organizer.agreement.start} - {props.organizer.agreement.end}
      </p>
    </div>
  );

  const extra = (
    <div className={classes.Extra}>
      <h3>Lisätiedot</h3>
      <p>{props.organizer.extra}</p>
    </div>
  );

  return (
    <div className={classes.OrganizerDetails}>
      <div className={classes.Grid}>
        {languages}
        {contact}
        {agreement}
        {extra}
      </div>
      <button className={classes.Modify}>Muokkaa</button>
    </div>
  );
};

export default organizerDetails;
