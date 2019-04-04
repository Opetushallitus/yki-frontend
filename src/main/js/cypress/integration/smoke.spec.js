describe('Smoke test', () => {
  if (Cypress.env('ADMIN_USER_PASSWORD') && Cypress.env('ADMIN_USER_PASSWORD').length > 0) {
    it('registration front page loads', () => {
      cy.visit('https://yki.untuvaopintopolku.fi/yki/ilmoittautuminen');
      cy.get('[data-cy=continue-button]').should('exist');
    });
    it('organizer registry front page loads', () => {
      cy.visit('https://virkailija.untuvaopintopolku.fi/yki/auth/cas');
      cy.get('[id=username]').type('ykitestaaja');
      cy.get('[id=password]').type(Cypress.env('ADMIN_USER_PASSWORD'));
      cy.get('input')
        .contains('Kirjaudu')
        .click();

      cy.get('h1')
        .contains('Kielitutkintojen järjestäjärekisteri')
        .should('exist');
      cy.get('[data-cy=registry-item]').should('exist');
    });
    it('exam sessions front page loads', () => {
      cy.visit('https://virkailija.untuvaopintopolku.fi/yki/auth/cas');
      cy.get('[id=username]').type('ykijarjestaja');
      cy.get('[id=password]').type(Cypress.env('ORG_USER_PASSWORD'));
      cy.get('input')
        .contains('Kirjaudu')
        .click();

      cy.get('h2')
        .contains('Tulevat tutkintotilaisuudet')
        .should('exist');
    });
  } else {
    it('smoke tests are executed only on CI', () => {});
  }
});
