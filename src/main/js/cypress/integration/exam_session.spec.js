describe('Exam session', () => {
  beforeEach(() => {
    cy.visit('/tutkintotilaisuudet');
  });

  it('front page loads', () => {
    cy.get('[data-cy=exam-session-header]');
  });

  it('front page contains list of 2 upcoming exam sessions', () => {
    cy.get('[data-cy=exam-session-header]');
    cy.get('[data-cy=exam-sessions-table-row]').should('have.length', 2);
  });

  it('front page contains agreement data', () => {
    cy.get('[data-cy=exam-session-organizer-agreement]');
    cy.get('[data-cy=exam-session-organizer-agreement-validity]').should('have.text', '1.1.2018 - 1.1.2019');
  });
});
