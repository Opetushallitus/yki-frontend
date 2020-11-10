describe('Payment', () => {
  it('Payment status should be successful', () => {
    cy.visit('/maksu/tila?status=payment-success&id=15');
    cy.contains('Maksu onnistui!');
    cy.get('[data-cy=payment-status-text]')
        .contains('Sinulle on lähetetty varmistus sähköpostilla.');
  });
  it('Payment status should be erroneous', () => {
    cy.visit('/maksu/tila?status=payment-error');
    cy.contains('Maksu epäonnistui.');
    cy.get('[data-cy=payment-status-text]')
        .contains('Voit yrittää maksaa uudelleen käyttämällä sähköpostissasi olevaa linkkiä.');
  });
  it('Payment status should be cancelled', () => {
    cy.visit('/maksu/tila?status=payment-cancel');
    cy.contains('Maksutapahtuma keskeytyi.');
    cy.get('[data-cy=payment-status-text]')
        .contains('Voit yrittää maksaa uudelleen käyttämällä sähköpostissasi olevaa linkkiä.');
  });
});
