/// <reference types="cypress" />

describe('Create Multisig Extrinsic', () => {
  before(() => {
    cy.visit(Cypress.config().baseUrl + '/ci/polkadotjs#r%3Dwss%3A%2F%2Fkusama-rpc.dwellir.com');
  });

  it('should display success div', () => {
    cy.get('.polkadotjs', { timeout: 120 * 1000 }).should('be.visible');
  });
});
