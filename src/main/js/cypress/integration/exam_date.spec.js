describe('Exam dates page', () => {
  beforeEach(() => {
    cy.visit('/tutkintopaivat');
  });

  afterEach(() => {
    cy.request('/reset-mocks');
  });

  const modifyDateId = '2081-01-30';
  const originalRowCount = 4;

  const getLanguageDataId = (dateId, lang, level) =>
    `[data-cy=exam-dates-row-language-${dateId}-${lang}-${level}]`;
  const getModifiedLanguageDataId = (lang, level) =>
    getLanguageDataId(modifyDateId, lang, level);

  // Params format: '1', 'January', '2050'
  // Selected picker needs to be open
  // Has trouble selecting from the last row of the calendar
  const chooseFlatpickerDate = (day, month, year) => {
    cy.get('.open .cur-year').type(year);
    cy.get('.open .flatpickr-monthDropdown-months').select(month);
    cy.get('.open .flatpickr-day')
      .contains(new RegExp(`^${day}$`))
      .click();
  };

  const fillExamDateViewDate = () => {
    cy.get('[data-cy=exam-date-new-exam-date]').click();
    chooseFlatpickerDate('1', 'maaliskuu', '2050');
  };

  const fillExamDateViewRegistrationPeriod = () => {
    cy.get('[data-cy=exam-date-new-registration-end]').click();
    chooseFlatpickerDate('25', 'tammikuu', '2050');

    cy.get('[data-cy=exam-date-new-registration-start]').click();
    chooseFlatpickerDate('1', 'tammikuu', '2050');
  };

  const addLanguage = (language, level) => {
    cy.get('[data-cy=exam-date-languages-select-language').select(language);
    cy.get('[data-cy=exam-date-languages-select-level').select(level);
    cy.get('[data-cy=exam-date-languages-add-new]').click();
  };

  it('should contain a table of upcoming exam dates', () => {
    cy.get('[data-cy=exam-dates-table-headers]');
    cy.get('[data-cy=exam-dates-table-headers]')
      .find('h3')
      .should('have.length', 6);

    cy.get('[data-cy=exam-dates-table-rows]');
    cy.get('[data-cy=exam-dates-table-rows]')
      .find('ul')
      .should('have.length', originalRowCount);
  });

  it('should not allow creation of new exam date without date', () => {
    cy.get('[data-cy=exam-dates-button-add-new]').click();
    fillExamDateViewRegistrationPeriod();
    addLanguage('englanti', 'keskitaso');

    cy.get('[data-cy=exam-dates-modify-save').should('be.disabled');
  });

  it('should not allow creation of new exam date without registration period', () => {
    cy.get('[data-cy=exam-dates-button-add-new]').click();
    fillExamDateViewDate();
    addLanguage('englanti', 'keskitaso');

    cy.get('[data-cy=exam-dates-modify-save').should('be.disabled');
  });

  it('should not allow creation of new exam date without languages', () => {
    cy.get('[data-cy=exam-dates-button-add-new]').click();
    fillExamDateViewDate();
    fillExamDateViewRegistrationPeriod();

    cy.get('[data-cy=exam-dates-modify-save').should('be.disabled');
  });

  it('should not allow adding the same language level twice', () => {
    cy.get('[data-cy=exam-dates-button-add-new]').click();
    addLanguage('englanti', 'keskitaso');

    cy.get('[data-cy=exam-date-languages-add-new]').should('be.disabled');

    cy.get('[data-cy=exam-date-languages-select-level').select('perustaso');
    cy.get('[data-cy=exam-date-languages-add-new]').should('be.enabled');
  });

  it('should allow creating exam date with valid details', () => {
    cy.get('[data-cy=exam-dates-button-add-new]').click();
    fillExamDateViewDate();
    fillExamDateViewRegistrationPeriod();
    addLanguage('englanti', 'keskitaso');

    cy.get('[data-cy=exam-dates-modify-save').should('be.enabled');
    cy.get('[data-cy=exam-dates-modify-save').click();

    cy.get('[data-cy=exam-dates-table-rows]')
      .find('ul')
      .should('have.length', originalRowCount + 1);
    cy.get('[data-cy=exam-dates-table-rows]').contains(
      new RegExp(`^${'1.3.2050'}$`),
    );
  });

  it('should allow modifying language levels for an existing exam date', () => {
    cy.get(`[data-cy=exam-dates-edit-button-${modifyDateId}]`).click();

    addLanguage('suomi', 'keskitaso');
    addLanguage('englanti', 'ylin taso');

    cy.get('[data-cy=exam-dates-modify-save').click();

    cy.get('[data-cy=exam-dates-table-rows]')
      .find('ul')
      .should('have.length', originalRowCount);

    cy.get('[data-cy=exam-dates-table-rows]').contains('30.1.2081');
    cy.get(`${getModifiedLanguageDataId('fin', 'KESKI')}`);
    cy.get(`${getModifiedLanguageDataId('eng', 'YLIN')}`);
  });

  it('should allow modifying post admission for an existing exam date', () => {
    cy.get(`[data-cy=exam-dates-edit-button-${modifyDateId}]`).click();
    cy.get(`[data-cy=exam-dates-modify-post-admission-toggle]`).click();

    cy.get('[data-cy=exam-dates-modify-post-admission-start-date]').click();
    chooseFlatpickerDate('15', 'joulukuu', '2080');

    cy.get('[data-cy=exam-dates-modify-post-admission-end-date]').click();
    chooseFlatpickerDate('15', 'tammikuu', '2081');

    cy.get('[data-cy=exam-dates-modify-save').click();

    cy.get('[data-cy=exam-dates-table-rows]')
      .find('ul')
      .should('have.length', originalRowCount);
    cy.get('[data-cy=exam-dates-table-rows]').contains('30.1.2081');

    cy.wait(1000);
    cy.get(`[data-cy=exam-dates-list-post-admission-${modifyDateId}`).contains(
      '15.12.2080 - 15.1.2081',
    );
  });

  it('should allow managing evaluation period for an exam date', () => {
    cy.get(`[data-cy=exam-dates-add-eval-text-2081-01-12]`).contains(
      '13.1.2081 - 13.2.2081',
    );
    cy.get(`[data-cy=exam-dates-add-eval-button-2081-01-12]`).should(
      'not.exist',
    );

    cy.get(`[data-cy=exam-dates-add-eval-text-2081-01-20]`).should('not.exist');
    cy.get(`[data-cy=exam-dates-add-eval-button-2081-01-20]`).should('exist');

    cy.get(`[data-cy=exam-dates-add-eval-button-2081-01-20]`).click();

    cy.get(`[data-cy=exam-date-new-registration-start`).should('exist');

    cy.get(`[data-cy=exam-date-new-registration-start`)
      .children('input')
      .should('have.value', '20.1.2081');
    cy.get(`[data-cy=exam-date-new-registration-end`)
      .children('input')
      .should('have.value', '20.1.2081');
  });

  it('should allow deleting an upcoming exam date with no exam sessions', () => {
    cy.get(`[data-cy=exam-dates-edit-button-${modifyDateId}]`).click();

    cy.get(`[data-cy=exam-dates-modify-delete]`).should('exist');
    cy.get(`[data-cy=exam-dates-modify-delete]`).click();

    const alertShown = cy.stub().as("alertShown");
    cy.on('window:alert', alertShown);

    cy.get('[data-cy=exam-dates-table-rows]')
      .find('ul')
      .should('have.length', originalRowCount - 1);
    cy.get(`[data-cy=exam-dates-list-date-${modifyDateId}]`).should(
      'not.exist',
    );
  });
});
