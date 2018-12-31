describe('Exam session', () => {
  beforeEach(() => {
    cy.visit('/tutkintotilaisuudet');
  });


  it('front page contains list of 2 upcoming exam sessions', () => {
    cy.get('[data-cy=exam-session-header]');
    cy.get('[data-cy=exam-sessions-table-row]').should('have.length', 2);
  });

  it('front page contains agreement data', () => {
    cy.get('[data-cy=exam-session-organizer-agreement]');
    cy.get('[data-cy=exam-session-organizer-agreement-validity]').should('have.text', '1.1.2018 - 1.1.2019');
  });

  it('new exam session can be created', () => {
    cy.log('exam session form opens when add button is clicked');
    cy.get('[data-cy=add-exam-session-button]').click();
    cy.get('[data-cy=exam-session-form]');

    cy.log('add button should be initially disabled');
    cy.contains('Tallenna tilaisuuden tiedot').should('be.disabled');
    
    cy.log('when mandatory data is filled add button is enabled');
    cy.get('[data-cy=radio-fin]').click();
    cy.get('[data-cy=radio-PERUS]').click();
    cy.get('[data-cy=radio-2019-01-27]').click();
    cy.get('[data-cy=input-max-participants]').type('50')
    cy.contains('Tallenna tilaisuuden tiedot').should('not.be.disabled');

    cy.log('when add button is clicked should return to frontpage');
    cy.contains('Tallenna tilaisuuden tiedot').click();
    cy.get('[data-cy=exam-sessions-table-row]').should('have.length', 3);

  });

});
