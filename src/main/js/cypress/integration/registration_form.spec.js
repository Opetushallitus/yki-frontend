describe('Registration form', () => {
  beforeEach(() => {
    cy.visit('/ilmoittautuminen/tutkintotilaisuus/1');
  });

  it('registration form validation errors are shown and form can be submitted only if valid', () => {
    cy.get('[data-cy=form-submit-button]').should('be.disabled');

    cy.log('input invalid phone number');
    cy.get('[data-cy=input-phoneNumber]').type('+348401234567');
    cy.get('[data-cy=input-email]').focus();
    cy.get('[data-cy=input-error-phoneNumber]').should('exist');

    cy.log('input invalid email');
    cy.get('[data-cy=input-email]').type('testtest.com');
    cy.get('[data-cy=radio-examLang-fi]').focus();
    cy.get('[data-cy=input-error-email]').should('exist');

    cy.get('[data-cy=form-submit-button]').should('be.disabled');
  });

  it('generic registration form initialization error is shown', () => {
    cy.server();
    cy.route({
      method: 'POST',
      url: '/yki/api/registration/init?lang=fi',
      status: 500,
      response: {
        success: false,
      },
    });
    cy.visit('/ilmoittautuminen/tutkintotilaisuus/1');
    cy.get('[data-cy=alert-title')
      .contains('Ilmoittautumislomakkeen tietojen hakeminen epäonnistui.')
      .should('exist');
  });

  it('registration exam session full error is shown', () => {
    cy.server();
    cy.route({
      method: 'POST',
      url: '/yki/api/registration/init?lang=fi',
      status: 409,
      response: {
        error: { full: true, closed: false, registered: false },
      },
    });
    cy.visit('/ilmoittautuminen/tutkintotilaisuus/1');
    cy.get('[data-cy=alert-title')
      .contains('Tutkintotilaisuus on täynnä.')
      .should('exist');
  });

  it('registration exam session closed error is shown', () => {
    cy.server();
    cy.route({
      method: 'POST',
      url: '/yki/api/registration/init?lang=fi',
      status: 409,
      response: {
        error: { full: false, closed: true, registered: false },
      },
    });
    cy.visit('/ilmoittautuminen/tutkintotilaisuus/1');
    cy.get('[data-cy=alert-title')
      .contains('Ilmoittautumisaika on päättynyt.')
      .should('exist');
  });

  it('registration participant already registered error is shown', () => {
    cy.server();
    cy.route({
      method: 'POST',
      url: '/yki/api/registration/init?lang=fi',
      status: 409,
      response: {
        error: { full: false, closed: false, registered: true },
      },
    });
    cy.visit('/ilmoittautuminen/tutkintotilaisuus/1');
    cy.get('[data-cy=alert-title')
      .contains('Voit ilmoittautua vain yhteen tutkintotilaisuuteen.')
      .should('exist');
  });

  it('registration form submit errors are shown and user can try submitting again', () => {
    cy.server();
    cy.route({
      method: 'POST',
      url: '/yki/api/registration/1/submit?lang=fi',
      status: 500,
      response: {
        success: false,
        error: { expired: true },
      },
    });
    cy.get('[data-cy=input-phoneNumber]').type('+358401234567');
    cy.get('[data-cy=input-email]').type('test@test.com');
    cy.get('[data-cy=input-confirmEmail]').type('test@test.com');
    cy.get('[data-cy=form-submit-button]').click();

    cy.log('form submit failed');
    cy.get('[data-cy=form-submit-error').should('exist');
    cy.get('[data-cy=form-submit-button]').should('exist');
    cy.get('[data-cy=alert-title')
      .contains('Lomakkeen täyttöaika on umpeutunut')
      .should('exist');
  });

  it('suomi.fi authenticated user can fill and submit form', () => {
    cy.get('[data-cy=input-phoneNumber]').type('+358401234567');
    cy.get('[data-cy=input-email]').type('test@test.com');
    cy.get('[data-cy=input-confirmEmail]').type('test@test.com');

    cy.log('exam language selection should exist when exam lang is not fi/se');
    cy.get('[data-cy=radio-examLang-en]').click();

    cy.get('[data-cy=form-submit-button]').click();

    cy.get('[data-cy=registration-success-header]').should('exist');
  });

  it('email authenticated user can fill and submit form', () => {
    cy.visit('/ilmoittautuminen/tutkintotilaisuus/2');

    cy.get('[data-cy=input-firstName]').type('firstName');
    cy.get('[data-cy=input-lastName]').type('lastName');
    cy.get('[data-cy=input-streetAddress]').type('Somestreet 11 A');
    cy.get('[data-cy=input-zip]').type('1234');
    cy.get('[data-cy=input-postOffice]').type('Somewhere');
    cy.get('[data-cy=input-phoneNumber]').type('+358401234567');

    cy.get('[data-cy=select-nationality]').select('643');
    cy.get('[data-cy=input-birthdate]').type('10.10.1970');
    cy.get('[data-cy=radio-certificateLang-en]').click();

    cy.log('exam language should not be shown for finnish and swedish');
    cy.get('[data-cy=radio-examLang-fi]').should('not.exist');
    cy.get('[data-cy=input-email]').should('not.exist');

    cy.get('[data-cy=form-submit-button]').click();

    cy.get('[data-cy=registration-success-header]').should('exist');
    cy.get('[data-cy=exam-details-card').should('exist');
  });
});
