describe('Quarantine CRUD page', () => {
  beforeEach(() => {
    cy.visit('/osallistumiskiellot/voimassa');
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

  it('open quarantine add form, fill it and submit', () => {
    const url = '/yki/api/virkailija/quarantine*';
    const payload = {
      birthdate: '1990-02-15',
      email: 'test@invalid.invalid',
      end_date: '2050-03-05',
      first_name: 'Testi',
      language_code: 'swe',
      last_name: 'Testi',
      phone_number: '0401234567',
      diary_number: '1234',
    };

    cy.intercept('POST', url).as('addQuarantine');

    cy.get('[data-cy=add-quarantine-btn] button').should('be.visible').click();
    cy.get('#language_code').should('be.visible').should('be.visible').select('swe');
    cy.get('#first_name').should('be.visible').type('Testi');
    cy.get('#last_name').should('be.visible').type('Testi');

    cy.get('#end_date').click();
    chooseFlatpickerDate('5', 'maaliskuu', 2050);

    cy.get('#birthdate').click();
    chooseFlatpickerDate('15', 'helmikuu', 1990);

    cy.get('#email').should('be.visible').type('test@invalid.invalid');
    cy.get('#phone_number').should('be.visible').type('0401234567');
    cy.get('#diary_number').should('be.visible').type('1234');

    cy.get('[data-cy=submit-quarantine-btn]').should('be.visible').click();
    cy.wait('@addQuarantine').then((interception) => {
      assert.deepEqual(interception.request.body, payload);
    });
  });

  it('edit quarantine form has correct values', () => {
    const url = '/yki/api/virkailija/quarantine/1*';
    const payload = {
      quarantine_lang: 'fin',
      birthdate: '2018-02-01',
      email: 'email@invalid.invalid',
      language_code: 'fin',
      phone_number: '0401234567',
      name: 'Max Syöttöpaine',
      ssn: '301079-900U',
      created: '2022-12-02T10:32:11.888Z',
      end_date: '2028-01-01',
      id: 1,
      last_name: 'Syöttöpaine',
      first_name: 'Max 2',
      diary_number: '12343',
    };

    cy.intercept('PUT', url).as('editQuarantine');

    cy.get('[data-cy=edit-quarantine-btn] button').should('be.visible').click();
    cy.get('#email').should('be.visible').should('have.value', 'email@invalid.invalid');
    cy.get('#phone_number').should('be.visible').should('have.value', '0401234567');
    cy.get('#first_name').should('be.visible').should('have.value', 'Max');
    cy.get('#last_name').should('be.visible').should('have.value', 'Syöttöpaine');
    cy.get('#end_date').should('have.value', '1.1.2028');
    cy.get('#birthdate').should('have.value', '1.2.2018');
    cy.get('#first_name').type(' 2');
    cy.get('#diary_number').type('3');

    cy.get('[data-cy=submit-quarantine-btn]').should('be.visible').click();
    cy.wait('@editQuarantine').then((interception) => {
      assert.deepEqual(interception.request.body, payload);
    });
  });

  it('delete quarantine should show confirm dialog', () => {
    const url = '/yki/api/virkailija/quarantine/1*';
    cy.intercept('DELETE', url).as('deleteQuarantine');

    cy.get('[data-cy=delete-quarantine-btn] button').should('be.visible').click();
    cy.get('[data-cy=cancel-delete-quarantine-btn]').should('be.visible');
    cy.get('[data-cy=confirm-delete-quarantine-btn]').should('be.visible').click();

    cy.wait('@deleteQuarantine');
  });
});
