/// <reference types="Cypress" />

describe('Dashboard Tests', () => {
  beforeEach(() => {
    cy.login();
    cy.contains('Logout');
  });

  it.only('should load dashboard', () => {
    cy.visit('/app'); // TODO Because of initial login bug, need to force a refresh

    cy.get('h4').should('have.text', 'Account Performance');
    cy.get('a[id=toAccounts]').should('be.visible');
  });
});
