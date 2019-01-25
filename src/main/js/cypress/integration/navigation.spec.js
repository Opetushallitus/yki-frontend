describe('Navigation', () => {
  beforeEach(() => {
    cy.server();
  });

  it('when admin is logged in then navigation shows registration and exam dates', () => {
    cy.log('Admin is logged in');
    cy.route({
      method: 'GET',
      url: '/yki/auth/user',
      response: {
        identity: {
          organizations: [
            {
              permissions: [{ palvelu: 'YKI', oikeus: 'YLLAPITAJA' }],
            },
          ],
        },
      },
    });

    cy.visit('/tutkintopaivat');
    cy.get('a')
      .contains('Tutkintopäivät')
      .should('exist');
    cy.get('a')
      .contains('Järjestäjärekisteri')
      .should('exist');
  });

  it('when organizer is logged in then navigation shows only exam sessions', () => {
    cy.log('Organizer is logged in')
    cy.route({
      method: 'GET',
      url: '/yki/auth/user?lang=fi',
      response: {
        identity: {
          organizations: [
            {
              permissions: [{ palvelu: 'YKI', oikeus: 'JARJESTAJA' }],
            },
          ],
        },
      },
    });

    cy.visit('/tutkintotilaisuudet');
    cy.get('a')
      .contains('Tutkintotilaisuudet')
      .should('exist');
    cy.get('a')
      .contains('Järjestäjärekisteri')
      .should('not.exist');
  });
});
