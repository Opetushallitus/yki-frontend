describe('Quarantine history page', () => {
  beforeEach(() => {
    cy.visit('/osallistumiskiellot/aiemmat');
  });

  afterEach(() => {
    cy.request('/reset-mocks');
  });

  it('set quarantine should show confirm dialog and then confirm should trigger request', () => {
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

  it('unset quarantine should show confirm and then confirm should trigger request', () => {
    const url = '/yki/api/virkailija/quarantine/2/registration/3/set*';
    const payload = { is_quarantined: false };
    cy.intercept('PUT', url).as('unsetQuarantine');

    cy.get('[data-cy=unset-quarantine-btn] button').should('be.visible').click();
    cy.get('[data-cy=cancel-set-quarantine-btn]').should('be.visible');
    cy.get('[data-cy=confirm-set-quarantine-btn]').should('be.visible').click();
    cy.wait('@unsetQuarantine').then((interception) => {
      assert.deepEqual(interception.request.body, payload);
    });
  });

});
