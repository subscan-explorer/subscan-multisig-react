import React, { Suspense } from 'react';
import { mount } from '@cypress/react';
import { Language } from '../components/Language';
// import '../index.scss';

describe('render', () => {
  it('should render the language switch with network color', () => {
    mount(
      <Suspense fallback="loading">
        <Language network="assethub-polkadot" />
      </Suspense>
    );

    cy.get('.ant-btn').should('be.visible');
    cy.get('.anticon').should('have.css', 'color');
  });
});
