/// <reference types="cypress" />

import { mount } from '@cypress/react';
import { ThemeSwitch } from '../components/ThemeSwitch';

describe('should switch global theme', () => {
  it('should switch global theme', () => {
    mount(<ThemeSwitch network="pangolin" />);

    cy.get('.ant-switch').should('be.visible');
  });
});
