import React from 'react';
import PropTypes from 'prop-types';

import classes from './Organizer.module.css';
import Hyperlink from '../../components/UI/Hyperlink/Hyperlink';

const organizer = props => {
  const languages = (
    <div>
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
    <div>
      <h3>Yhteystiedot</h3>
      <p>{props.organizer.contact.name}</p>
      <Hyperlink type="phone" to={props.organizer.contact.phone} />
      <Hyperlink type="email" to={props.organizer.contact.email} />
      <p>{address}</p>
      <Hyperlink to={props.organizer.website} />
    </div>
  );

  const contract = (
    <div>
      <h3>Sopimuskausi</h3>
      <p>
        {props.organizer.agreement.start} - {props.organizer.agreement.end}
      </p>
    </div>
  );

  const extra = (
    <div>
      <h3>Lisätiedot</h3>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer porta
        ligula turpis, eu augue porta et. Aenean fermentum ut vehicula rhoncus.
        Orci varius natoque penatibus et magnis dis parturient montes, nascetur
        ridiculus mus.
      </p>
    </div>
  );

  return (
    <div className={classes.Organizer}>
      <h2>{props.organizer.name}</h2>
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
