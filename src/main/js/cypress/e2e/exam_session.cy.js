import registrations from '../../dev/rest/examSessions/registrations.json';

// Handle 404 errors which are returned when inputing the fields
Cypress.on('uncaught:exception', (err, runnable) => {
  if (err.message.includes('code 404')) {
    return false;
  }
});

describe('Exam sessions', () => {
  beforeEach(() => {
    cy.visit('/tutkintotilaisuudet');
  });

  afterEach(() => {
    cy.request('/reset-mocks');
  });

  const fillExamSessionForm = () => {
    selectSchool();
    cy.get('[data-cy=radio-fin]').click();
    cy.get('[data-cy=radio-PERUS]').click();
    cy.get('[data-cy=radio-2081-01-30]').click();
    cy.get('[data-cy=input-max-participants]').type('100');
    cy.get('[data-cy=input-streetAddress]').type('address');
    cy.get('[data-cy=input-zip]').type('33100');
    cy.get('[data-cy=input-postOffice]').type('city');
    cy.get('#contactEmail').type('example.contact@test.invalid');
  };

  const selectSchool = () => {
    cy.get('[data-cy=select-officeOid]').select('1.2.246.562.10.82346919515');
  };

  it('front page contains list of upcoming exam sessions', () => {
    cy.get('[data-cy=exam-session-header]');
    cy.get('[data-cy=upcoming-exam-sessions-table]')
      .find('div')
      .should('have.length', 4);
  });

  it('front page contains list of past exam sessions', () => {
    cy.get('[data-cy=past-exam-sessions-table]')
      .find('div')
      .should('have.length', 2);
  })

  it('front page contains agreement data', () => {
    cy.get('[data-cy=exam-session-organizer-agreement]');
    cy.get('[data-cy=exam-session-organizer-agreement-validity]').should(
      'have.text',
      '1.1.2018 - 1.1.2029',
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
    cy.get('[data-cy=upcoming-exam-sessions-table]')
      .find('div')
      .should('have.length', 5);
  });

  it('exam session field validation errors disable submit button', () => {
    cy.get('[data-cy=add-exam-session-button]').click();
    fillExamSessionForm();
    cy.get('button')
      .contains('Tallenna tilaisuuden tiedot')
      .should('not.be.disabled');
    cy.get('[data-cy=input-zip]').type('abcdef');
    cy.get('button')
      .contains('Tallenna tilaisuuden tiedot')
      .should('be.disabled');
  });

  it('should allow to create same exam session to different offices', () => {
    cy.get('[data-cy=add-exam-session-button]').click();
    fillExamSessionForm();
    cy.get('button')
      .contains('Tallenna tilaisuuden tiedot')
      .click();
    cy.get('[data-cy=upcoming-exam-sessions-table]')
      .find('div')
      .should('have.length', 5);

    cy.get('[data-cy=add-exam-session-button]').click();
    fillExamSessionForm();
    cy.get('span').contains('Tutkintotilaisuus on jo olemassa');

    cy.get('[data-cy=select-officeOid]').select('1.2.246.562.10.87157719573');
    cy.get('span')
      .contains('Tutkintotilaisuus on jo olemassa')
      .should('not.exist');
  });

  it('should undo disabled level and exam date selections in case of language change', () => {
    cy.get('[data-cy=add-exam-session-button]').click();
    selectSchool();
    cy.get('[data-cy=radio-fin]').click();
    cy.get('[data-cy=radio-PERUS]').click();
    cy.get('[data-cy=radio-2081-01-30]').click();
    cy.get('[data-cy=radio-deu]').click();
    cy.get('[data-cy=radio-PERUS]').should('not.be.checked');
    cy.get('[data-cy=radio-2081-01-30]').should('not.be.checked');
  });

  it('should undo the disabled exam date selection in case of level change', () => {
    cy.get('[data-cy=add-exam-session-button]').click();
    selectSchool();
    cy.get('[data-cy=radio-fin]').click();
    cy.get('[data-cy=radio-PERUS]').click();
    cy.get('[data-cy=radio-2081-01-30]').click();
    cy.get('[data-cy=radio-KESKI]').click();
    cy.get('[data-cy=radio-2081-01-30]').should('not.be.checked');
  });

  it('selecting exam session opens details with participant list', () => {
    cy.get('[data-cy=past-exam-sessions-table-row-0]').click();
    cy.get('[data-cy=participant-list]').should('exist');

    cy.log('registration link is shown');
    cy.get('[data-cy=registration-link]')
      .contains('https://localhost/yki/tutkintotilaisuus/1')
      .should('exist');

    cy.log('list shows paid registrations');
    cy.get(
      '[data-cy=participant-list] [data-cy=registration-COMPLETED]',
    ).should('exist');

    cy.log('list shows not paid registrations');
    cy.get(
      '[data-cy=participant-list] [data-cy=registration-SUBMITTED]',
    ).should('exist');

    cy.log('list shows cancelled registrations');
    cy.get(
      '[data-cy=participant-list] [data-cy=registration-CANCELLED]',
    ).should('exist');

    cy.log('list shows paid and cancelled registrations');
    cy.get(
      '[data-cy=participant-list] [data-cy=registration-PAID_AND_CANCELLED]',
    ).should('exist');

    cy.log('list shows expired registrations');
    cy.get('[data-cy=participant-list] [data-cy=registration-EXPIRED]').should(
      'exist',
    );
  });

  it('exam session can be updated', () => {
    cy.get('[data-cy=upcoming-exam-sessions-table-row-0]').click();
    cy.get('button')
      .contains('Tallenna muutokset')
      .should('be.disabled');

    cy.get('[data-cy=input-max-participants]')
      .clear()
      .type('100');
    cy.get('[data-cy=input-location]')
      .clear()
      .type('auditorio A3');
    cy.get('[data-cy=input-extra-fi]')
      .clear()
      .type('extra-fi');
    cy.get('[data-cy=input-extra-sv]')
      .clear()
      .type('extra-sv');
    cy.get('[data-cy=input-extra-en]')
      .clear()
      .type('extra-en');
    cy.get('button')
      .contains('Tallenna muutokset')
      .click();

    cy.get('[data-cy=upcoming-exam-sessions-table-row-0]').click();
    cy.get('[data-cy=input-max-participants]').should('have.value', '100');
    cy.get('[data-cy=input-location]').should('have.value', 'auditorio A3');
    cy.get('[data-cy=input-extra-fi]').should('have.value', 'extra-fi');
    cy.get('[data-cy=input-extra-sv]').should('have.value', 'extra-sv');
    cy.get('[data-cy=input-extra-en]').should('have.value', 'extra-en');
  });

  it('exam session can be deleted when registration has not started', () => {
    cy.get('[data-cy=past-exam-sessions-table-row-0]').click();
    cy.get('button')
      .contains('Poista')
      .should('not.exist');

    cy.visit('/tutkintotilaisuudet');

    cy.get('[data-cy=upcoming-exam-sessions-table-row-0]').click();
    cy.get('button')
      .contains('Poista')
      .should('exist');
  });

  it('registration can be cancelled', () => {
    cy.get('[data-cy=past-exam-sessions-table-row-0]').click();
    cy.get('[data-cy=participant-1]').should('exist');

    cy.get('button')
      .contains('Peru osallistuminen')
      .click();
    cy.get('[data-cy=button-confirm-action]').click();

    cy.get('[data-cy=participant-1]').should('not.exist');
  });

  it('registration can be relocated to next exam session', () => {
    cy.get('[data-cy=past-exam-sessions-table-row-0]').click();
    cy.get('[data-cy=participant-1]').should('exist');
    cy.get('[data-cy=button-action]')
      .first()
      .trigger('mouseover');

    cy.get('[data-cy=button-action]')
      .first()
      .click();
    cy.get('label select')
      .first()
      .select('30.12.2099 Amiedu, Strömberginkuja 3');

    cy.intercept(
      'POST',
      '/yki/api/virkailija/organizer/1.2.3.4/exam-session/1/registration/1/relocate?lang=fi*',
      {
        statusCode: 201,
      },
    );

    cy.intercept(
      'GET',
      'yki/api/virkailija/organizer/1.2.3.4/exam-session/1/registration?lang=fi*',
      {
        body: {
          ...registrations,
          participants: registrations.participants.filter(
            p => p.registration_id !== 1,
          ),
        },
      },
    );

    cy.get('[data-cy=button-confirm-action]').click();
    cy.get('[data-cy=participant-1]').should('not.exist');
  });

  const paKey = key => `[data-cy=exam-session-post-admission-${key}]`;

  const fillPostAdmissionForm = quota => {
    cy.get(paKey('input-quota'))
      .clear()
      .type(quota)
      .blur();
    cy.get(paKey('submit-button')).click();
  };

  const postAdmissionFieldsValidate = (startDate, endDate, quota) => {
    cy.get(paKey('input-startDate'))
      .should('be.disabled')
      .and('have.value', startDate);
    cy.get(paKey('input-endDate'))
      .should('be.disabled')
      .and('have.value', endDate);
    cy.get(paKey('input-quota'))
      .should('be.disabled')
      .and('have.value', quota);
  };

  it('post admission can be activated', () => {
    const quota = '5';

    cy.get('[data-cy=upcoming-exam-sessions-table-row-1]').click();
    cy.get(paKey('add-button')).click();
    fillPostAdmissionForm(quota);
    postAdmissionFieldsValidate('26.11.2080', '20.12.2080', quota);

    cy.get('[data-cy=modal-close-button]').click();
    cy.get('[data-cy=upcoming-exam-sessions-table-row-1]').click();
    postAdmissionFieldsValidate('26.11.2080', '20.12.2080', quota);
  });

  it('post admission quota can be edited', () => {
    const newQuota = '15';

    cy.get('[data-cy=upcoming-exam-sessions-table-row-2]').click();
    cy.get(paKey('modify-button')).click();
    fillPostAdmissionForm(newQuota);
    postAdmissionFieldsValidate('30.11.2080', '25.12.2080', newQuota);
  });

  it('post admission can be deactivated', () => {
    cy.get('[data-cy=upcoming-exam-sessions-table-row-2]').click();

    // Can be cancelled
    cy.get(paKey('deactivate-button')).click();
    cy.get(paKey('cancel')).click();
    postAdmissionFieldsValidate('30.11.2080', '25.12.2080', '10');

    // Can be deleted
    cy.get(paKey('deactivate-button')).click();
    cy.get(paKey('confirm')).click();
    cy.get(paKey('add-button')).should('exist');
  });
});
