describe('Quarantine CRUD page', () => {
  beforeEach(() => {
    cy.visit('/karenssi');
  });

  afterEach(() => {
    cy.request('/reset-mocks');
  });

  const chooseFlatpickerDate = (day, month, year) => {
    cy.get('.open .cur-year').type(year);
    cy.get('.open .flatpickr-monthDropdown-months').select(month);
    cy.get('.open .flatpickr-day')
      .contains(new RegExp(`^${day}$`))
      .click();
  };

  it('open quarantine add form and fill it', () => {
    cy.get('[data-cy=add-quarantine-btn] button').click();
    cy.get('#language_code').should('be.visible').select('swe');
    cy.get('#first_name').should('be.visible').type('Testi');
    cy.get('#last_name').should('be.visible').type('Testi');
    cy.get('#email').should('be.visible').type('test@invalid.invalid');
    cy.get('#phone_number').should('be.visible').type('0401234567');

    cy.get('#end_date').click();
    chooseFlatpickerDate('5', 'maaliskuu', 2050);

    cy.get('#birthdate').click();
    chooseFlatpickerDate('15', 'helmikuu', 1990);
  });
});
