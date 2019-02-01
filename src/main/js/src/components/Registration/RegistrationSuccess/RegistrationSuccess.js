import React from 'react';
import PropTypes from 'prop-types';
import { withNamespaces } from 'react-i18next';

import classes from './RegistrationSuccess.module.css';
import Hyperlink from '../../UI/Hyperlink/Hyperlink';

export const registrationSuccess = props => {
  return (
    <div className={classes.RegistrationSuccess}>
      <div>
        <h1>Ilmoittautuminen onnistui!</h1>
        <p>Olet ilmoittautunut tutkintotilaisuuteen:</p>
      </div>
      <div>
        <p>
          {`Saat maksuohjeet ja varmistuksen ilmoittautumisesta
          sähköpostiosoitteeseen ${props.formData.email}`} 
        </p>
      </div>
      <div className={classes.InfoBox}>
        <p><b>Tärkeää!</b> Muistathan, että tutkintomaksu on maksettava määräaikaan mennessä. Muutoin ilmoittautumisesi peruuntuu, etkä voi osallistua tutkintotilaisuuteen.</p>
      </div>
      <div className={classes.BackButton}>
        <Hyperlink  to={'/yki'} text={'Palaa etusivulle'}/>
      </div>
    </div>
  );
};

registrationSuccess.propTypes = {
  initData: PropTypes.object.isRequired,
  formData: PropTypes.object.isRequired,
};

export default withNamespaces()(registrationSuccess);
