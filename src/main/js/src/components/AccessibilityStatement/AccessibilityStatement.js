import React from 'react';
import './accessibilityStatement.css';

/*
This document was generated using https://www.saavutettavuusvaatimukset.fi/
*/
const AccessibilityStatement = () => (
  <article>
    <header>
      <h1>
        Tervetuloa, tämä on organisaation Opetushallitus Saavutettavuusseloste
      </h1>
    </header>

    <section className="statement__section">
      <p>
        Tämä saavutettavuusseloste koskee palvelua https://yki.opintopolku.fi ja
        on laadittu / päivitetty 26.10.2021. Palvelua koskee laki digitaalisten
        palvelujen tarjoamisesta, jossa edellytetään, että julkisten
        verkkopalvelujen on oltava saavutettavia.
      </p>
      <p>
        Palvelun saavutettavuuden on arvioinut ulkopuolinen
        asiantuntijaorganisaatio.
      </p>
    </section>

    <section className="statement__section">
      <h2>Digipalvelun saavutettavuuden tila</h2>
      <p>Täyttää saavutettavuusvaatimukset osittain.</p>
    </section>

    <h2>Ei-saavutettava sisältö</h2>

    <section className="statement__section">
      <section className="statement__inaccessible">
        <h3>
          3. Verkkosivusto ei ole vielä kaikilta osin vaatimusten mukainen
        </h3>

        <ul className="flaws">
          <li className="flaw">
            <h4 className="flaw__title">
              Havaittava: Videosta puuttuu tekstitys
            </h4>
            <h5 className="flaw__subtitle">
              Saavuttamaton sisältö ja sen puutteet
            </h5>
            <p>Videosta puuttuu tekstitys</p>
            <h5>Saavutettavuusvaatimukset jotka eivät täyty</h5>
            <ul className="flaw__wcag">
              <li>1.2.1 Pelkkä audio tai pelkkä video (tallennettu)</li>
            </ul>
          </li>
          <li className="flaw">
            <h4 className="flaw__title">
              Havaittava: Ruudunlukijan käytössä puutteita
            </h4>
            <h5 className="flaw__subtitle">
              Saavuttamaton sisältö ja sen puutteet
            </h5>
            <p>
              Ruudunlukija lukee nappien taakse piilotettua sisältöä vaikkei
              sisältöä olisi avattu
            </p>
            <h5>Saavutettavuusvaatimukset jotka eivät täyty</h5>
            <ul className="flaw__wcag">
              <li>1.3.2 Merkitykseen vaikuttava järjestys</li>
            </ul>
          </li>
          <li className="flaw">
            <h4 className="flaw__title">
              Havaittava: Sovelluksesta puuttuu nimilappuja
            </h4>
            <h5 className="flaw__subtitle">
              Saavuttamaton sisältö ja sen puutteet
            </h5>
            <p>Sovelluksesta puuttuu nimilappuja</p>
            <h5>Saavutettavuusvaatimukset jotka eivät täyty</h5>
            <ul className="flaw__wcag">
              <li>1.3.5 Määrittele syötteen tarkoitus</li>
            </ul>
          </li>
          <li className="flaw">
            <h4 className="flaw__title">
              Havaittava: Burger menun sisältö ei näy kokonaan
            </h4>
            <h5 className="flaw__subtitle">
              Saavuttamaton sisältö ja sen puutteet
            </h5>
            <p>
              Burger menun sisältö ei näy kokonaan kaikilla mobiililaitteilla
            </p>
            <h5>Saavutettavuusvaatimukset jotka eivät täyty</h5>
            <ul className="flaw__wcag">
              <li>1.4.10 Responsiivisuus</li>
            </ul>
          </li>
          <li className="flaw">
            <h4 className="flaw__title">Hallittava: Näppäimistöansa</h4>
            <h5 className="flaw__subtitle">
              Saavuttamaton sisältö ja sen puutteet
            </h5>
            <p>
              Näppäimistöansa mobiilimenun kielivalinnassa liikkuessa
              tab-näppäimellä
            </p>
            <h5>Saavutettavuusvaatimukset jotka eivät täyty</h5>
            <ul className="flaw__wcag">
              <li>2.1.2 Ei näppäimistöansaa</li>
            </ul>
          </li>
          <li className="flaw">
            <h4 className="flaw__title">
              Ymmärrettävä: Merkinnät eivät kaikilta osin johdonmukaisia
            </h4>
            <h5 className="flaw__subtitle">
              Saavuttamaton sisältö ja sen puutteet
            </h5>
            <p>
              Linkit ja painikkeet eivät aina ole johdonmukaisesti merkittyjä
            </p>
            <h5>Saavutettavuusvaatimukset jotka eivät täyty</h5>
            <ul className="flaw__wcag">
              <li>3.2.4 Johdonmukainen merkitseminen</li>
            </ul>
          </li>
          <li className="flaw">
            <h4 className="flaw__title">
              Ymmärrettävä: Virheellisesti syötettyyn tai puuttuvaan tietoon
              ohjaaminen
            </h4>
            <h5 className="flaw__subtitle">
              Saavuttamaton sisältö ja sen puutteet
            </h5>
            <p>Ruudunlukijaa ei ohjata virheelliseen tai puuttuvaan tietoon</p>
            <h5>Saavutettavuusvaatimukset jotka eivät täyty</h5>
            <ul className="flaw__wcag">
              <li>3.3.3 Virheen korjausehdotus</li>
            </ul>
          </li>
          <li className="flaw">
            <h4 className="flaw__title">
              Toimintavarma: Kaikki pääsisältö ei ole kääritty main elementin
              sisään
            </h4>
            <h5 className="flaw__subtitle">
              Saavuttamaton sisältö ja sen puutteet
            </h5>
            <p>Kaikki pääsisältö ei ole kääritty main elementin sisään</p>
            <h5>Saavutettavuusvaatimukset jotka eivät täyty</h5>
            <ul className="flaw__wcag">
              <li>4.1.2 Nimi, rooli, arvo</li>
            </ul>
          </li>
        </ul>
      </section>
    </section>

    <section className="statement__section">
      <h2>
        Huomasitko saavutettavuuspuutteen digipalvelussamme? Kerro se meille ja
        teemme parhaamme puutteen korjaamiseksi.
      </h2>
      <h3>Verkkolomakkeella</h3>
      <p>
        <a
          href="https://opintopolku.fi/wp/palautetta-opintopolusta"
          target="_blank"
          rel="noopener noreferrer"
        >
          Anna saavutettavuuspalautetta tällä verkkolomakkeella
        </a>
      </p>
      <h3>Sähköpostilla</h3>
      <p>palaute@opintopolku.fi</p>
    </section>

    <section className="statement__section">
      <h2>Valvontaviranomainen</h2>
      <p>
        Jos huomaat sivustolla saavutettavuusongelmia, anna ensin palautetta
        meille eli sivuston ylläpitäjälle. Vastauksessa voi mennä 14 päivää. Jos
        et ole tyytyväinen saamaasi vastaukseen tai et saa vastausta lainkaan
        kahden viikon aikana,{' '}
        <a
          href="https://www.saavutettavuusvaatimukset.fi/oikeutesi/"
          target="_blank"
          rel="noopener noreferrer"
        >
          voit tehdä ilmoituksen Etelä-Suomen aluehallintovirastoon{' '}
          <span className="screen-reader-text">(avautuu uuteen ikkunaan)</span>
        </a>
        . Etelä-Suomen aluehallintoviraston sivulla kerrotaan tarkasti, miten
        ilmoituksen voi tehdä ja miten asia käsitellään.
      </p>
      <h2>Valvontaviranomaisen yhteystiedot</h2>
      <p>
        Etelä-Suomen aluehallintovirasto
        <br />
        Saavutettavuuden valvonnan yksikkö
        <br />
        www.saavutettavuusvaatimukset.fi
        <br />
        saavutettavuus(at)avi.fi
        <br />
        puhelinnumero vaihde 0295 016 000
      </p>
    </section>

    <section className="statement__section">
      <h2>Teemme jatkuvasti työtä saavutettavuuden parantamiseksi</h2>
      <h3>
        Tarjoamme tukea käyttäjille joille digipalvelut eivät ole
        saavutettavissa
      </h3>
      <p>
        Olemme sitoutuneet digipalveluiden saavutettavuuden parantamiseen.
        <br />
        Huomasitko saavutettavuuspuutteen? Kerro se meille ja teemme parhaamme
        puutteen korjaamiseksi.
      </p>
    </section>
  </article>
);

export default AccessibilityStatement;
