describe('Registry item form', () => {
  beforeEach(() => {
    cy.server();
    cy.route({
      method: 'POST',
      url: '/organisaatio-service/rest/organisaatio/v3/findbyoids?lang=fi',
    }).as('findbyoids');
    cy.visit('/jarjestajarekisteri');
  });

  afterEach(() => {
    cy.request('/reset-mocks');
  });

  it.skip('organizer can be added', () => {
    cy.wait('@findbyoids');
    cy.get('[data-cy=registry-item]').should('have.length', 2);

    cy.contains('Lisää järjestäjä').click();
    cy.get('#organizationSearchField').type('turun yli');
    cy.get('[data-cy=10089]').click();

    cy.get('#agreementStart').click();
    cy.get('.flatpickr-day.today')
      .first()
      .click();

    cy.get('#agreementEnd').click();
    cy.get('.flatpickr-day.today')
      .last()
      .click();

    cy.get('#contactName').type('Example Contact');
    cy.get('#contactEmail').type('example.contact@test.com');
    cy.get('#contactPhone').type('+35840123456');
    cy.get('[data-cy=registry-item-form-submit]').click();

    cy.log('new organizer is added');
    cy.get('[data-cy=registry-item]').should('have.length', 3);
  });
});
