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
  cy.get(selectors.usernameInput).type(user.username);
  cy.get(selectors.signInPasswordInput).type(user.password);
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
  const type = "RRSP";

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
    .select(type)
    .should("have.value", type);
  cy.get(selectors.createAccountButton).click();
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
