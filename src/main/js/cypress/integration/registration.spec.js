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
});
