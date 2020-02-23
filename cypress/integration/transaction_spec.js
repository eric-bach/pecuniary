/* eslint-disable */

describe("Transactions:", function() {
  beforeEach(function() {
    cy.login();

    cy.visit("/accounts");
    cy.url().should("include", "/accounts");

    cy.createAccount();

    // Assert - List Account
    cy.contains("div", "My Account");
    cy.contains("div", "My Account Description");

    cy.visit("/home");
    cy.delay(100);
    cy.visit("/accounts");

    // Display Account
    cy.get('[data-test="view-account-button"]')
      .first()
      .click();

    // Assert Transaction
    cy.get('[data-test="add-transaction-button"]').click();
    cy.url().should("include", "/transactions/new");
    cy.contains("button", "Submit").should("be.visible");
  });

  afterEach(function() {
    cy.deleteAccount();
  });

  it("Cancel Add Transaction", function() {
    // Act - Cancel Transaction
    cy.get('[data-test="cancel-submit-transaction-button"]').click();
  });

  it("Add Transaction", function() {
    // Act - Create Transaction
    cy.createTransaction();
  });
});
