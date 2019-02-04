describe('Registration', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Description page loads', () => {
    cy.contains('Yleiset kielitutkinnot');
  });

  it('Return button returns user back to description page', () => {
    cy.get('button').click();
    cy.contains('Suomi').click();
    cy.contains('Perustaso').click();
    cy.contains('Koko maa').click();
    cy.contains('Takaisin').click();
    cy.contains('Takaisin').click();
    cy.contains('Takaisin').click();
    cy.contains('Takaisin').click();
    cy.contains('Yleiset kielitutkinnot');
  });

  it('Navigation works using browser history', () => {
    cy.get('button').click();
    cy.contains('Suomi').click();
    cy.contains('Perustaso').click();
    cy.contains('Koko maa').click();
    cy.go('back');
    cy.go('back');
    cy.go('back');
    cy.go('back');
    cy.contains('Yleiset kielitutkinnot');
  });

  it('Filters persist through exam session selection', () => {
    cy.get('button').click();
    cy.contains('Suomi').click();
    cy.contains('Perustaso').click();
    cy.contains('Koko maa').click();
    cy.get('select').contains('Suomi');
    cy.get('select').contains('Perustaso');
    cy.get('select').contains('Koko maa');
  });

  it('Default filters get applied when directly visiting exam session list page', () => {
    cy.visit('/valitse-tutkintotilaisuus');
    cy.get('select').contains('Suomi');
    cy.get('select').contains('Kaikki tasot');
    cy.get('select').contains('Koko maa');
  });

  it('Filters work', () => {
    cy.visit('/valitse-tutkintotilaisuus');
    cy.get('[data-cy=exam-session-list-item]').should('have.length', 2);
    cy.get('[data-cy=language-filter]').select('Saksa');
    cy.get('[data-cy=level-filter]').select('Ylin taso');
    cy.get('[data-cy=location-filter]').select('Jyväskylä');
    cy.get('[data-cy=exam-session-list-item]').should('have.length', 1);
  });
  
  it('Registration form can be submitted', () => {
    cy.visit('/ilmoittautuminen/tutkintotilaisuus/1');
    cy.get('[data-cy=input-phoneNumber]').type('+358401234567');
    cy.get('[data-cy=input-email]').type('test@test.com');
    cy.get('button')
      .contains('Vahvista ilmoittautuminen')
      .click();
      cy.get('h1')
      .contains('Ilmoittautuminen onnistui!')
      .should('exist');
  });

  it('Registration form validation errors are shown and form can be submitted only if valid', () => {
    cy.visit('/ilmoittautuminen/tutkintotilaisuus/1');
    cy.get('[data-cy=form-submit-button]')
      .should('be.disabled');
  
  });

  // it('Registration form submit errors are shown and user can try again', () => {
  //   cy.visit('/ilmoittautuminen/tutkintotilaisuus/1');
  // });

});
