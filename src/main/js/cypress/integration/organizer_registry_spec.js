describe('Organizer registry', () => {
  beforeEach(() => {
    cy.visit('/yki/');
  });

  it('front page loads', () => {
    cy.get('h1').contains('Kielitutkintojen järjestäjärekisteri');
  });

  it('add organizer button opens new page', () => {
    cy.get('button')
      .contains('Lisää järjestäjä')
      .click();
    cy.get('h1').contains('Hae lisättävä järjestäjä');
  });
});
