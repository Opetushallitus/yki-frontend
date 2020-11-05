import React from 'react';
import {useTranslation} from "react-i18next";

import classes from './PersonalDataConsent.module.css';

const PersonalDataConsentFI = () => {
  const {t} = useTranslation();

  return (
    <div className={classes.ConsentText}>
      <main>
        <article>
          <h2>{t('common.yki.consent.title')}</h2>
          <div>
            <h3>{t('common.yki.consent.firstHeader')}</h3>
            <p>
              Opetushallitus PL 380, 00531 Helsinki
              kirjaamo@oph.fi, opetushallitus@oph.fi, 029 533 1000 (vaihde)
            </p>
            <p>
              Rekisteriin liittyvät yhteydenotot (mm. oikaisut) osoitteeseen: yki@oph.fi
            </p>
            <p>
              Tietosuojavastaava Jyrki Tuohela tietosuoja@oph.fi, 029 533 1000 (vaihde)
            </p>
          </div>
          <div>
            <h3>{t('common.yki.consent.secondHeader')}</h3>
            <p>
              Yleisestä kielitutkintojärjestelmästä, sen kehittämisestä ja valvonnasta vastaa Opetushallitus. Tietojen
              käsittelyn tarkoituksena on mahdollistaa sähköinen ilmoittautuminen yleisiin kielitutkintoihin,
              suoritettuja kielitutkintoja ja tutkintoihin sisältyviä osakokeita koskevien tietojen säilyttäminen sekä
              yleisen kielitutkinnon toimivuuden seuranta.
            </p>
            <p>
              Käsittelyperusteena on lakisääteinen velvoite (tietosuoja-asetuksen 6 artiklan 1c). Käsittely perustuu
              Yleisiä kielitutkintoja koskevaan lakiin (964/2004).
            </p>
          </div>
          <div>
            <h3>{t('common.yki.consent.thirdHeader')}</h3>
            <p>
              Rekisterissä käsitellään seuraavia henkilötietoja: nimi, henkilötunnus tai syntymäaika (jos henkilöllä ei
              ole suomalaista henkilötunnusta), kansalaisuus, sukupuoli, tutkinnon suorittamispaikka, tutkintokieli,
              saadut taitotasoarviot, tutkintokertojen ajankohta ja tarpeelliset yhteystiedot.
            </p>
          </div>
          <div>
            <h3>{t('common.yki.consent.fourthHeader')}</h3>
            <p>
              Opetushallitus luovuttaa henkilötietoja säännöllisesti Maahanmuuttovirastolle. Tietoja ei luovuteta
              kolmansiin maihin.
            </p>
          </div>
          <div>
            <h3>{t('common.yki.consent.fifthHeader')}</h3>
            <p>
              Yleisiin kielitutkintoihin ilmoittautuvien tiedot hävitetään 6 kuukauden kuluttua siitä, kun
              tutkintotilaisuus on pidetty. Yleisen kielitutkinnon suorittaneen henkilön tiedot siirtyvät
              tutkintorekisteriin, jossa tietoja säilytetään 30 vuotta.
            </p>
          </div>
          <div>
            <h3>{t('common.yki.consent.sixthHeader')}</h3>
            <p>
              Rekisteröidyllä on oikeus saada rekisterinpitäjältä tieto, mitä häntä koskevia henkilötietoja rekisterissä
              käsitellään. Rekisterinpitäjän on toimitettava pyynnöstä jäljennös käsiteltävistä henkilötiedoista.
              Rekisteröidyllä on oikeus vaatia, että rekisterinpitäjä oikaisee ilman aiheetonta viivytystä rekisteröityä
              koskevat epätarkat ja virheelliset henkilötiedot. Rekisteröidyn tulee yksilöidä ja perustella, mitä tietoa
              hän vaatii korjattavaksi, mikä on hänen mielestään oikea tieto ja miten korjaus halutaan tehtäväksi.
              Rekisteröidyllä on oikeus käsittelyn rajoittamiseen tietyissä tilanteissa.
            </p>
            <p>
              Rekisteröidyllä on oikeus siihen, että rekisterinpitäjä ilmoittaa henkilötietojen oikaisusta tai poistosta
              tai käsittelyn rajoituksesta sille, jolle tietoja on edelleen luovutettu, mikäli tietoja luovutetaan
              eteenpäin.
            </p>
            <p>
              Oikeuksien käyttöön liittyvät pyynnöt tulee osoittaa rekisterin yhteyshenkilölle: Opetushallitus, PL 380,
              00531 Helsinki. Tarkastuspyyntöön rekisteröidyn tulee liittää tietojen etsimiseen tarvittavat tiedot (Nimi
              ja henkilötunnus).
            </p>
            <p>
              Rekisteröity voi valittaa valvontaviranomaiselle, Suomessa tietosuojavaltuutetulle
              https://tietosuoja.fi/yhteystiedot, jos hän epäilee rikkomusta henkilötietojensa käsittelyssä.
            </p>
          </div>
        </article>
        <button className={'YkiButton'} onClick={() => window.top.close()}>{t('common.close')}</button>
      </main>
    </div>
  );
}

export default PersonalDataConsentFI;