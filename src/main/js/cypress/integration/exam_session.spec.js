describe('Exam session', () => {
  beforeEach(() => {
    cy.visit('/tutkintotilaisuudet');
  });

  afterEach(() => {
    cy.request('/reset-mocks');
  });

  const fillExamSessionForm = () => {
    cy.get('[data-cy=radio-fin]').click();
    cy.get('[data-cy=radio-PERUS]').click();
    cy.get('[data-cy=radio-2019-01-27]').click();
    cy.get('[data-cy=input-max-participants]').type('100');
    cy.get('[data-cy=input-address]').type('address');
  };

  it('front page contains list of upcoming exam sessions', () => {
    cy.get('[data-cy=exam-session-header]');
    cy.get('[data-cy=exam-sessions-table]')
      .find('div')
      .should('have.length', 2);
  });

  it('front page contains agreement data', () => {
    cy.get('[data-cy=exam-session-organizer-agreement]');
    cy.get('[data-cy=exam-session-organizer-agreement-validity]').should(
      'have.text',
      '1.1.2018 - 1.1.2019',
    );
  });

  it('new exam session can be created', () => {
    cy.log('exam session form opens when add button is clicked');
    cy.get('[data-cy=add-exam-session-button]').click();
    cy.get('[data-cy=exam-session-form]');

    cy.log('add button should be initially disabled');
    cy.get('button')
      .contains('Tallenna tilaisuuden tiedot')
      .should('be.disabled');

    cy.log('when mandatory data is filled add button is enabled');
    fillExamSessionForm();
    cy.get('button')
      .contains('Tallenna tilaisuuden tiedot')
      .should('not.be.disabled');

    cy.log('when add button is clicked should return to frontpage');
    cy.get('button')
      .contains('Tallenna tilaisuuden tiedot')
      .click();
    cy.get('[data-cy=exam-sessions-table]')
      .find('div')
      .should('have.length', 3);
  });

  it('should allow to create same exam session to different offices', () => {
    cy.get('[data-cy=add-exam-session-button]').click();
    fillExamSessionForm();
    cy.get('button')
      .contains('Tallenna tilaisuuden tiedot')
      .click();
    cy.get('[data-cy=exam-sessions-table]')
      .find('div')
      .should('have.length', 3);

    cy.get('[data-cy=add-exam-session-button]').click();
    fillExamSessionForm();
    cy.get('span').contains('Tutkintotilaisuus on jo olemassa');

    cy.get('[data-cy=select-officeOid]').select('1.2.246.562.10.87157719573');
    cy.get('span')
      .contains('Tutkintotilaisuus on jo olemassa')
      .should('not.exist');
  });

  it('selecting upcoming exam session opens details modal', () => {
    cy.get('[data-cy=exam-sessions-table-row-0]').click();
    cy.get('[data-cy=participant-list]');
  });
});
