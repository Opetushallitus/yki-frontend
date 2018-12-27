describe('Registry', () => {
  beforeEach(() => {
    cy.server();
    cy.route({
      method: 'POST',
      url: '/organisaatio-service/rest/organisaatio/v3/findbyoids',
    }).as('findbyoids');
    cy.visit('/jarjestajarekisteri');
  });

  it('should load registry page', () => {
    cy.get('h1').contains('Kielitutkintojen järjestäjärekisteri');
  });

  it('should show listing of registry items', () => {
    cy.get('[data-cy=registry-item]').should('have.length', 2);
  });

  it('should show registry item details when clicking item', () => {
    cy.contains('Amiedu').click();
    cy.contains('Kielitutkinnot');
    cy.contains('Yhteystiedot');
    cy.contains('Järjestäjäsopimus');
    cy.contains('Lisätiedot');
  });

  it('should show only one registry item after filtering by city', () => {
    cy.wait('@findbyoids');
    cy.get('input').type('Helsinki');
    cy.get('[data-cy=registry-item]').should('have.length', 1);
  });

  it('should show only one registry item after filtering by language', () => {
    cy.wait('@findbyoids');
    cy.get('[data-cy=language-filter]').select('Saksa');
    cy.get('[data-cy=registry-item]').should('have.length', 1);
  });

  it('should show notification text after no items match filters', () => {
    cy.wait('@findbyoids');
    cy.get('input').type('Gibberish');
    cy.get('[data-cy=registry-item]').should('have.length', 0);
    cy.contains('Annetuilla hakuehdoilla ei löytynyt järjestäjiä.');
  });

  it('should open modal after clicking add organizer button', () => {
    cy.contains('Lisää järjestäjä').click();
    cy.get('h1').contains('Lisää uusi kielitutkintojen järjestäjä');
  });
});
