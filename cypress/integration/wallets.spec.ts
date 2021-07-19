/// <reference types="cypress" />

describe('Wallets display and create', () => {
  before(() => {
    cy.visit(Cypress.config().baseUrl);
  });

  it('should display create wallets button', () => {
    cy.get('a[href="/wallet"]', { timeout: 20 * 1000 })
      .should('be.visible')
      .find('button')
      .should('have.class', 'ant-btn-primary');
  });

  it('should navigate to wallet create page', () => {
    cy.get('a[href="/wallet"]')
      .click()
      .then(() => {
        cy.url().should('include', 'wallet');
      });
  });

  it('should display create wallet correctly', () => {
    cy.get('#wallet_name').should('be.visible');
    cy.get('#wallet_threshold').should('be.visible').and('have.value', 2);
    cy.get('input[type=search]').should('have.length', 3);
    cy.get('button.ant-btn-dashed').should('exist');
    cy.get('button[type=submit]').should('exist');
  });
});
