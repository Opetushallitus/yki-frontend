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

  // it('Filters persist through exam session selection', () => {
  //   cy.get('button').click();
  //   cy.contains('Suomi').click();
  //   cy.contains('Perustaso').click();
  //   cy.get('select').contains('Suomi');
  //   cy.get('select').contains('Perustaso');
  //   cy.get('select').contains('Koko maa');
  // });
});
