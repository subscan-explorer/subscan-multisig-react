/// <reference types="cypress" />

describe('Wallets display and create', () => {
  before(() => {
    cy.log(Cypress.config().baseUrl + '/ci/polkadotjs#r%3Dwss%3A%2F%2Fkusama-rpc.dwellir.com');
    cy.visit(Cypress.config().baseUrl + '/ci/polkadotjs#r%3Dwss%3A%2F%2Fkusama-rpc.dwellir.com');
  });

  it('should display create wallets button', () => {
    cy.get('.polkadotjs', { timeout: 60 * 1000 }).should('be.visible');
  });
});
