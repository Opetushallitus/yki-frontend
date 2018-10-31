import React from 'react';
import PropTypes from 'prop-types';

import classes from './Organizer.module.css';
import Hyperlink from '../../components/UI/Hyperlink/Hyperlink';

const organizer = props => {
  const languages = (
    <div>
      <p>
        <strong>Kielet</strong>
      </p>
      {props.organizer.languages.map(lang => {
        return <p key={lang}>{lang}</p>;
      })}
    </div>
  );

  const address = `${props.organizer.address.street}, ${
    props.organizer.address.zipCode
  } ${props.organizer.address.city}`;

  const contact = (
    <div>
      <p>
        <strong>Yhteystiedot</strong>
      </p>
      <p>{props.organizer.contact.name}</p>
      <Hyperlink type="phone" to={props.organizer.contact.phone} />
      <Hyperlink type="email" to={props.organizer.contact.email} />
      <p>{address}</p>
      <Hyperlink to={props.organizer.website} />
    </div>
  );

  const contract = (
    <div>
      <p>
        <strong>Sopimuskausi</strong>
      </p>
      <p>
        {props.organizer.agreement.start} - {props.organizer.agreement.end}
      </p>
    </div>
  );

  const extra = (
    <p>
      <strong>Lisätiedot</strong>
    </p>
  );

  return (
    <div className={classes.Organizer}>
      <h3>{props.organizer.name}</h3>
      {languages}
      {contact}
      {contract}
      {extra}
    </div>
  );
};

organizer.propTypes = {
  organizer: PropTypes.object.isRequired,
};

export default organizer;
