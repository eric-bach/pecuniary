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

  it('should create new account and transaction', () => {
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

    cy.wait(5000);
    cy.get('a').last().click();

    // Create Transaction
    cy.get('a[data-cy=addTransaction]').click();
    cy.get('#type').parent().click().get('ul > li[data-value="Buy"]').click();
    cy.get('input[name=symbol]').type('AAPL');
    cy.get('input[name=shares]').type('100');
    cy.get('input[name=price]').type('100');
    cy.get('button[name=create]').click();
    cy.wait(2000);

    // Verify Account and Transaction
    cy.visit('/app/accounts');
    cy.contains('Cypress Test');
    cy.get('a').last().click();
    cy.contains('AAPL');
  });

  it('should edit existing account', () => {
    cy.get('button[name=toAccounts]').click();
    cy.visit('/app/accounts'); // TODO Because of initial login bug, need to force a refresh
    cy.contains('Cypress Test Account');

    cy.get('a').last().click();
    cy.get('button[name=toggleEdit]').click();
    cy.get('button[name=edit]').click();
    cy.wait(500);
  });

  it('should delete existing account', () => {
    cy.get('button[name=toAccounts]').click();
    cy.visit('/app/accounts'); // TODO Because of initial login bug, need to force a refresh
    cy.contains('Cypress Test Account');

    cy.get('a').last().click();
    cy.get('button[name=toggleEdit]').click();
    cy.get('button[name=delete]').click();
    cy.wait(500);

    // Assert
    cy.get('a').should('have.length.at.least', 4);
  });
});
