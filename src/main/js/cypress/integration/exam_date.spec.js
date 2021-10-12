describe('Exam dates page', () => {
  beforeEach(() => {
    cy.visit('/tutkintopaivat');
  });

  afterEach(() => {
    cy.request('/reset-mocks');
  });

  const newDateId = '2050-03-01';
  const modifyDateId = '2081-01-30';
  const originalRowCount = 4;

  const getLanguageDataId = (dateId, lang, level) =>
    `[data-cy=exam-dates-row-language-${dateId}-${lang}-${level}]`;
  const getNewLanguageDataId = (lang, level) =>
    getLanguageDataId(newDateId, lang, level);
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

  const fillNewExamDateForm = () => {
    cy.get('[data-cy=exam-date-new-registration-start]').click();
    chooseFlatpickerDate('1', 'Tammikuu', '2050');

    cy.get('[data-cy=exam-date-new-registration-end]').click();
    chooseFlatpickerDate('25', 'Tammikuu', '2050');

    cy.get('[data-cy=exam-date-new-exam-date]').click();
    chooseFlatpickerDate('1', 'Maaliskuu', '2050');

    cy.get('[data-cy=exam-date-languages-add-new]').click();

    cy.get('[data-cy=exam-date-languages-select-language').select('Englanti');
    cy.get('[data-cy=exam-date-languages-select-level').select('Keskitaso');
    cy.get('[data-cy=exam-date-languages-add-new]').click();
  };

  it('exam dates page contains a table of upcoming exam dates', () => {
    cy.get('[data-cy=exam-dates-table-headers]');
    cy.get('[data-cy=exam-dates-table-headers]')
      .find('h3')
      .should('have.length', 7);
  });

  it('exam dates table should have exam dates listed', () => {
    cy.get('[data-cy=exam-dates-table-rows]');
    cy.get('[data-cy=exam-dates-table-rows]')
      .find('label')
      .should('have.length', originalRowCount);
  });

  it('exam date with exam sessions assigned to it should have a disabled checkbox', () => {
    cy.get('[data-cy=exam-dates-list-checkbox-2081-01-12]').click();
    cy.get(`[data-cy=exam-dates-button-delete`).should('be.disabled');
  });

  it('should not allow creation when registration start date is set after registration end date', () => {
    cy.get('[data-cy=exam-dates-button-add-new]').click();
    fillNewExamDateForm();
    cy.get('[data-cy=exam-date-new-registration-start]').click();
    chooseFlatpickerDate('1', 'Helmikuu', '2050');
    cy.get('[data-cy=exam-dates-button-save-new').should('be.disabled');
  });

  it('should not allow creation when registration end date is set after registration end', () => {
    cy.get('[data-cy=exam-dates-button-add-new]').click();
    fillNewExamDateForm();
    cy.get('[data-cy=exam-date-new-registration-end]').click();
    chooseFlatpickerDate('20', 'Maaliskuu', '2050');
    cy.get('[data-cy=exam-dates-button-save-new').should('be.disabled');
  });

  it('should not allow creation with no added languages', () => {
    cy.get('[data-cy=exam-dates-button-add-new]').click();
    cy.get('[data-cy=exam-dates-button-save-new').should('be.disabled');
  });

  it('new exam date can be created', () => {
    cy.get('[data-cy=exam-dates-button-add-new]').click();
    fillNewExamDateForm();
    cy.get('[data-cy=exam-dates-button-save-new').click();
    cy.get('[data-cy=exam-dates-table-rows]');
    cy.get('[data-cy=exam-dates-table-rows]')
      .find('label')
      .should('have.length', originalRowCount + 1);
    cy.get('[data-cy=exam-dates-table-rows]').contains(
      new RegExp(`^${'1.3.2050'}$`),
    );
    cy.get(`[data-cy=exam-dates-list-date-${newDateId}]`);
    cy.get(`${getNewLanguageDataId('fin', 'PERUS')}`);
    cy.get(`${getNewLanguageDataId('eng', 'KESKI')}`);
  });

  it('can add languages and remove languages from exam date', () => {
    const addLanguage = (lang, level) => {
      cy.get('[data-cy=exam-date-languages-add-row]').click();
      cy.get('[data-cy=exam-date-languages-select-language-new]').select(lang);
      cy.get('[data-cy=exam-date-languages-select-level-new]').select(level);
      cy.get('[data-cy=exam-date-languages-button-add]').click();
    };

    // Add new languages
    cy.get(`[data-cy=exam-dates-edit-button-${modifyDateId}]`).click();
    addLanguage('Suomi', 'Keskitaso');
    addLanguage('Englanti', 'Ylin taso');
    cy.get('[data-cy=exam-dates-modify-save').click();

    cy.get('[data-cy=exam-dates-table-rows]')
      .find('label')
      .should('have.length', originalRowCount);
    cy.get('[data-cy=exam-dates-table-rows]').contains('30.1.2081');
    cy.get(`${getModifiedLanguageDataId('fin', 'KESKI')}`);
    cy.get(`${getModifiedLanguageDataId('eng', 'YLIN')}`);

    // Remove one language
    cy.get(`[data-cy=exam-dates-edit-button-${modifyDateId}]`).click();
    cy.get(`[data-cy=exam-date-languages-button-delete-eng-YLIN`).click();
    cy.get('[data-cy=exam-dates-modify-save').click();

    cy.get('[data-cy=exam-dates-table-rows]')
      .find('label')
      .should('have.length', originalRowCount);
    cy.get('[data-cy=exam-dates-table-rows]').contains('30.1.2081');
    cy.get(`${getModifiedLanguageDataId('fin', 'KESKI')}`);
    cy.get(`${getModifiedLanguageDataId('eng', 'YLIN')}`).should('not.exist');
  });

  it('can enable post admissions for exam date', () => {
    cy.get(`[data-cy=exam-dates-edit-button-${modifyDateId}]`).click();
    cy.get(`[data-cy=exam-dates-modify-post-admission-toggle]`).click();
    cy.get('[data-cy=exam-dates-modify-post-admission-start-date]').click();
    chooseFlatpickerDate('15', 'Joulukuu', '2080');
    cy.get('[data-cy=exam-dates-modify-post-admission-end-date]').click();
    chooseFlatpickerDate('15', 'Tammikuu', '2081');
    cy.get('[data-cy=exam-dates-modify-save').click();
    cy.get('[data-cy=exam-dates-table-rows]')
      .find('label')
      .should('have.length', originalRowCount);
    cy.get('[data-cy=exam-dates-table-rows]').contains('30.1.2081');
    cy.get(`[data-cy=exam-dates-list-post-admission-${modifyDateId}`).contains(
      '15.12.2080 - 15.1.2081',
    );
  });

  it('has evaluation peroids or a button displayed', () => {
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

  it('can delete the exam date', () => {
    cy.get(`[data-cy=exam-dates-list-checkbox-${modifyDateId}]`).should(
      'not.be.disabled',
    );
    cy.get(`[data-cy=exam-dates-list-checkbox-${modifyDateId}]`).click();
    cy.get(`[data-cy=exam-dates-button-delete`).should('not.be.disabled');
    cy.get(`[data-cy=exam-dates-button-delete`).click();

    // Can cancel
    cy.get(`[data-cy=exam-dates-delete-cancel`).click();
    cy.get(`[data-cy=exam-dates-button-delete`).click();

    // Can delete
    cy.get(`[data-cy=exam-dates-delete-confirm`).click();
    cy.get('[data-cy=exam-dates-table-rows]')
      .find('label')
      .should('have.length', originalRowCount - 1);
    cy.get(`[data-cy=exam-dates-list-date-${modifyDateId}]`).should(
      'not.exist',
    );
  });
});
