/// <reference types="Cypress" />

describe('Launch APp', () => {
  it('should display app', () => {
    cy.visit('/');

    cy.contains('Home Page');
  });
});
