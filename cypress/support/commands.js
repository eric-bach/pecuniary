/* eslint-disable */

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
Cypress.Commands.add("login", user => {
  cy.visit("/");
  cy.get(selectors.usernameInput).type(Cypress.env("username"));
  cy.get(selectors.signInPasswordInput).type(Cypress.env("password")); // This is read from the CYPRESS_password environment variableb on the host
  cy.get(selectors.signInSignInButton)
    .contains("Sign In")
    .click();
  cy.get(selectors.signOutButton).contains("Logout");
});

Cypress.Commands.add("createAccount", account => {
  cy.visit("/accounts");
  cy.url().should("include", "/accounts");

  const name = "My Account";
  const description = "My Account Description";
  const tfsa = "TFSA";
  const rrsp = "RRSP";

  // Create a new Account
  cy.contains("button", "Account").should("be.visible");
  cy.get(selectors.addAccountButton).click();
  cy.contains("button", "Create").should("be.visible");
  cy.contains("button", "Cancel").should("be.visible");
  cy.get(selectors.accountNameInput)
    .type(name)
    .should("have.value", name);
  cy.get(selectors.accountDescriptionInput)
    .type(description)
    .should("have.value", description);
  cy.get(selectors.accountTypeSelector)
    .select(tfsa)
    .should("have.value", tfsa);
  cy.get(selectors.accountTypeSelector)
    .select(rrsp)
    .should("have.value", rrsp);
  cy.get(selectors.createAccountButton).click();
});

Cypress.Commands.add("deleteAccount", () => {
  cy.visit("/accounts");
  cy.url().should("include", "/accounts");

  // Delete first Account
  cy.get('[data-test="account-label"]')
    .first()
    .click();
  cy.get('[data-test="edit-account-button"]').click();
  cy.get('[data-test="delete-account-button"]').click();
});

Cypress.Commands.add("createTransaction", symbol => {
  cy.get('[data-test="transaction-type-selector"]')
    .select("Buy")
    .should("have.value", "Buy");
  cy.get('[data-test="transaction-date-input"]').should("have.value", Cypress.moment().format("YYYY-MM-DD"));

  cy.get('[data-test="symbol-input"]').type(symbol);
  cy.get('[data-test="shares-input"]')
    .type("1000")
    .should("have.value", "1000");
  cy.get('[data-test="price-input"]')
    .type("98.10")
    .should("have.value", "98.10");
  cy.get('[data-test="commission-input"]')
    .type("9.95")
    .should("have.value", "9.95");

  cy.get('[data-test="create-transaction-button"]').click();
});

Cypress.Commands.add("delay", time => {
  cy.visit("/");
  cy.wait(time);
  cy.visit("/accounts");
});

export const selectors = {
  // Auth component classes
  usernameInput: '[data-test="username-input"]',
  signInPasswordInput: '[data-test="sign-in-password-input"]',
  signInSignInButton: '[data-test="sign-in-sign-in-button"]',
  signOutButton: '[data-test="sign-out-button"]',
  addAccountButton: '[data-test="add-account-button"]',
  accountNameInput: '[data-test="account-name-input"]',
  accountDescriptionInput: '[data-test="account-description-input"]',
  accountTypeSelector: '[data-test="account-type-selector"]',
  createAccountButton: '[data-test="create-account-button"]'
};
