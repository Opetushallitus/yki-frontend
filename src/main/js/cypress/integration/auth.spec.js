describe('Authorization', () => {
  if (Cypress.env('ADMIN_USER_PASSWORD') && Cypress.env('ADMIN_USER_PASSWORD').length > 0) {
    it('init session endpoint should not be accessible in yki domain', () => {
      cy.request({
        url: 'https://yki.untuvaopintopolku.fi/yki/auth/initsession',
        failOnStatusCode: false,
      }).then(response => {
        expect(response.status).to.eq(404);
      });
    });
    it('init session endpoint should not be accessible in virkailija domain', () => {
      cy.request({
        url: 'https://virkailija.untuvaopintopolku.fi/yki/auth/initsession',
        failOnStatusCode: false,
      }).then(response => {
        expect(response.status).to.eq(404);
      });
    });
  } else {
    it('authorization tests are executed only on CI', () => {});
  }
});
