describe('Quarantine CRUD page', () => {
  beforeEach(() => {
    cy.visit('/karenssi/mahdolliset');
  });

  afterEach(() => {
    cy.request('/reset-mocks');
  });

  it('set quarantine should show confirm dialog', () => {
    cy.get('[data-cy=set-quarantine-btn] button').should('be.visible').click();
    cy.get('[data-cy=confirm-set-quarantine-btn]').should('be.visible');
    cy.get('[data-cy=cancel-set-quarantine-btn]').should('be.visible');
  });

  it('confirm dialog should allow cancel', () => {
    cy.get('[data-cy=set-quarantine-btn] button').should('be.visible').click();
    cy.get('[data-cy=cancel-set-quarantine-btn]').should('be.visible').click();
    cy.get('[data-cy=confirm-set-quarantine-btn]').should('not.exist');
  });
});
