describe('Evaluation Exam List', () => {
  beforeEach(() => {
    cy.visit('/tarkistusarviointi/');
  });

  it('Shows price boxes', () => {
    cy.get('[data-cy=price-container').should('exist');
    cy.get('[data-cy=price-element-READING').should('exist');
  });

  it('Shows list of exams, the button is disabled if the evaluation period is not open', () => {
    cy.get('[data-cy=evaluation-period-1').should('exist');
    cy.get('[data-cy=evaluation-period-2').should('exist');

    cy.get('[data-cy=evaluation-period-button-1').should('not.be.disabled');
    cy.get('[data-cy=evaluation-period-button-2').should('be.disabled');
  });
});
