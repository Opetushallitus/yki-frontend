describe('Quarantine CRUD page', () => {
  beforeEach(() => {
    cy.visit('/karenssi/historia');
  });

  afterEach(() => {
    cy.request('/reset-mocks');
  });

});
