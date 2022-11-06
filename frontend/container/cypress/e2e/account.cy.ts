/// <reference types="Cypress" />

describe('List Accounts', () => {
  beforeEach(() => {
    cy.login();
    cy.contains('Logout');
  });

  it('should display accounts page', () => {
    cy.get('button[name=toAccounts]').click();
    cy.visit('/app/accounts'); // TODO Because of initial login bug, need to force a refresh

    cy.contains('Accounts');
    cy.get('a[name=addAccount]').should('be.visible');
  });
});

describe('Create/Edit/Delete Account', () => {
  beforeEach(() => {
    cy.login();
    cy.contains('Logout');
  });

  it('should create new account', () => {
    cy.get('button[name=toAccounts]').click();
    cy.visit('/app/accounts'); // TODO Because of initial login bug, need to force a refresh

    cy.contains('Accounts');
    cy.get('a[name=addAccount]').click();

    // Create Account
    cy.get('input[name=name]').type('Cypress Test');
    cy.get('[name="type"]').parent().click();
    cy.findByRole('option', { name: 'TFSA' }).click();
    cy.get('input[name=description]').type('Cypress Test Account');

    cy.get('button[name=create]').click();
  });

  it('should edit existing account', () => {});

  it('should delete existing account', () => {});

  afterEach(() => {
    // TODO Delete any test accounts
  });
});
