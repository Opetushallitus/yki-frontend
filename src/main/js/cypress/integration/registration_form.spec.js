describe('Registration form', () => {
  beforeEach(() => {
    cy.visit('/ilmoittautuminen/tutkintotilaisuus/1');
  });

  it('registration form can be submitted', () => {
    cy.get('[data-cy=input-phoneNumber]').type('+358401234567');
    cy.get('[data-cy=input-email]').type('test@test.com');
    cy.get('[data-cy=form-submit-button]').click();
    cy.get('h1')
      .contains('Ilmoittautuminen onnistui!')
      .should('exist');
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

  it('registration form init error is shown', () => {
    cy.server();
    cy.route({
      method: 'POST',
      url: '/yki/api/registration/init?lang=fi',
      status: 500,
      response: {
        success: false,
      },
    });
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
    cy.get('[data-cy=alert-title')
      .contains('Ilmoittautumisaika on päättynyt.')
      .should('exist');
  });

  it('registration participant laready registered error is shown', () => {
    cy.server();
    cy.route({
      method: 'POST',
      url: '/yki/api/registration/init?lang=fi',
      status: 409,
      response: {
        error: { full: false, closed: false, registered: true },
      },
    });
    cy.get('[data-cy=alert-title')
      .contains('Voit ilmoittautua vain yhteen tutkintotilaisuuteen.')
      .should('exist');
  });

  it('registration form submit errors are shown and user can try again', () => {
    cy.server();
    cy.route({
      method: 'POST',
      url: '/yki/api/registration/submit?lang=fi',
      status: 500,
      response: {
        success: false,
      },
    });
    cy.get('[data-cy=input-phoneNumber]').type('+358401234567');
    cy.get('[data-cy=input-email]').type('test@test.com');
    cy.get('[data-cy=form-submit-button]').click();

    cy.log('Form submit failed');
    cy.get('[data-cy=form-submit-error').should('exist');
    cy.get('[data-cy=form-submit-button]').should('exist');
  });
});
