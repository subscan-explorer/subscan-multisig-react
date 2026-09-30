/// <reference types="cypress" />

// Read-only UI smoke test: no extension permissions, account creation or signing.
describe('Wallets display and validation', () => {
  const networkHash = '#r%3Dwss%3A%2F%2Fasset-hub-polkadot-rpc.n.dwellir.com';

  before(() => {
    cy.visit('/' + networkHash);
  });

  it('opens the current network wallet form', () => {
    cy.get('a[href^="/wallet#"]', { timeout: 60000 }).should('be.visible').click();
    cy.url().should('include', '/wallet');
    cy.get('#wallet_name').should('be.visible');
    cy.get('#wallet_threshold').should('be.visible').and('have.value', 2);
    cy.get('button[type=submit]').should('exist');
  });

  it('rejects a threshold above the initial three members', () => {
    cy.get('#wallet_threshold').clear().type('4').blur();
    cy.get('.ant-form-item-explain-error')
      .should('be.visible')
      .invoke('text')
      .should('match', /Threshold|签名阈值/);
  });
});
