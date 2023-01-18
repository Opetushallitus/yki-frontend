describe('Quarantine CRUD page', () => {
  beforeEach(() => {
    cy.visit('/karenssi/mahdolliset');
  });

  afterEach(() => {
    cy.request('/reset-mocks');
  });

  it('set quarantine should show confirm dialog and confirm should trigger request', () => {
    const url = '/yki/api/virkailija/quarantine/1/registration/2/set*';
    const payload = { is_quarantined: true };
    cy.intercept('PUT', url).as('setQuarantine');

    cy.get('[data-cy=set-quarantine-btn] button').should('be.visible').click();
    cy.get('[data-cy=cancel-set-quarantine-btn]').should('be.visible');
    cy.get('[data-cy=confirm-set-quarantine-btn]').should('be.visible').click();
    cy.wait('@setQuarantine').then((interception) => {
      assert.deepEqual(interception.request.body, payload);
    });
  });

  it('confirm dialog should allow cancel', () => {
    cy.get('[data-cy=set-quarantine-btn] button').should('be.visible').click();
    cy.get('[data-cy=cancel-set-quarantine-btn]').should('be.visible').click();
    cy.get('[data-cy=confirm-set-quarantine-btn]').should('not.exist');
  });

  it('no-set quarantine should trigger request', () => {
    const url = '/yki/api/virkailija/quarantine/1/registration/2/set*';
    const payload = { is_quarantined: false };
    cy.intercept('PUT', url).as('setQuarantine');

    cy.get('[data-cy=set-no-quarantine-btn] button').should('be.visible').click();
    cy.wait('@setQuarantine').then((interception) => {
      assert.deepEqual(interception.request.body, payload);
    });
  });
});
