/// <reference types="cypress" />

describe.skip('Wallets display and create', () => {
  before(() => {
    cy.visit(Cypress.config().baseUrl);
  });

  it('should display create wallets button', () => {
    cy.get('a[href="/wallet#r%3Dwss%3A%2F%2Frpc.polkadot.io"]', { timeout: 20 * 1000 })
      .should('be.visible')
      .find('button')
      .should('have.class', 'ant-btn');
  });

  it('should navigate to wallet create page', () => {
    cy.get('a[href="/wallet#r%3Dwss%3A%2F%2Frpc.polkadot.io"]')
      .click()
      .then(() => {
        cy.url().should('include', 'wallet');
      });
  });

  it('should display create wallet correctly', () => {
    cy.get('#wallet_name').should('be.visible');
    cy.get('#wallet_threshold').should('be.visible').and('have.value', 2);
    cy.get('input[type=search]').should('have.length', 3);
    cy.get('button[type=submit]').should('exist');
  });
});
