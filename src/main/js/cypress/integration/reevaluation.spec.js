describe('Re-evaluation form', () => {
  beforeEach(() => {
    cy.visit('/tarkistusarviointi/1');
  });
  it('Exam subtests, prices, buttons and total are visible', () => {
    cy.get('[data-cy=text-and-button-READING]')
      .children('button')
      .should('exist');
    cy.get('[data-cy=reeval-subtest-total]').should('include.text', '0 €');
    cy.get('[data-cy=reeval-form-submit-button]').should('be.disabled');
  });

  it('Validates fields', () => {
    cy.get('[data-cy=subtest-error').should('not.exist');

    cy.get('[data-cy=input-firstName]').focus();
    cy.get('[data-cy=subtest-error').should('exist');
    cy.get('[data-cy=text-and-button-READING]')
      .children('button')
      .click();
    cy.get('[data-cy=subtest-error').should('not.exist');
    cy.get('[data-cy=input-lastName]').type('Testaaja');
    cy.get('[data-cy=input-error-firstName').should('exist');
    cy.get('[data-cy=input-firstName]').type('Testi');
    cy.get('[data-cy=input-error-firstName').should('not.exist');

    cy.get('[data-cy=input-email]').type('testtest.com');
    cy.get('[data-cy=input-birthdate]').focus();
    cy.get('[data-cy=input-error-email]').should('exist');
    cy.get('[data-cy=input-birthdate]').clear();
    cy.get('[data-cy=input-email]').type('test@test.com');

    cy.get('[data-cy=input-birthdate]').type('1990.1.1');
    cy.get('[data-cy=input-firstName]').focus();
    cy.get('[data-cy=input-error-birthdate]').should('exist');
    cy.get('[data-cy=input-birthdate]').clear();
    cy.get('[data-cy=input-birthdate]').type('1.1.2500');
    cy.get('[data-cy=input-firstName]').focus();
    cy.get('[data-cy=input-error-birthdate]').should('exist');
    cy.get('[data-cy=input-birthdate]').clear();
    cy.get('[data-cy=input-birthdate]').type('1.1.1990');

    cy.get('[data-cy=reeval-form-submit-button]').should('be.disabled');

    cy.get('[data-cy=input-consent]').click();

    cy.get('[data-cy=reeval-form-submit-button]').should('not.be.disabled');
  });
});
