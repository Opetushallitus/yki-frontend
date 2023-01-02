describe('Quarantine CRUD page', () => {
  beforeEach(() => {
    cy.visit('/karenssi/mahdolliset');
  });

  afterEach(() => {
    cy.request('/reset-mocks');
  });

});
