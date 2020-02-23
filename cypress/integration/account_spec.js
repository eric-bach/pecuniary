/* eslint-disable */

describe("Accounts:", function() {
  beforeEach(function() {
    cy.login();

    cy.visit("/accounts");
    cy.url().should("include", "/accounts");
  });

  it("Cancel Creating Account", function() {
    // Arrange - create Account
    cy.contains("a", "Create Account").should("be.visible");
    cy.get('[data-test="create-account-button"]').click();
    cy.contains("button", "Submit").should("be.visible");
    cy.contains("button", "Cancel").should("be.visible");

    // Act - cancel creating Account
    cy.get('[data-test="cancel-submit-account-button"]').click();

    // Assert
    cy.url().should("include", "/accounts");
    cy.contains("a", "Create Account").should("be.visible");
  });

  it("Create Account", function() {
    // Act - Create Account
    cy.createAccount();

    // Assert - List Account
    cy.contains("div", "My Account");
    cy.contains("div", "My Account Description");
  });

  it("View Account", function() {
    // Act - Display Account
    cy.get('[data-test="view-account-button"]')
      .first()
      .click();
    cy.url().should("include", "/accounts/view");

    // Assert - Display Account
    cy.contains("div", "My Account");
    cy.contains("div", "My Account Description");
    cy.contains("a", "Add Transaction");
  });

  it("Cancel Edit Account", function() {
    // Act - Cancel Edit Account
    cy.get('[data-test="edit-account-button"]')
      .first()
      .click();
    cy.url().should("include", "/accounts/edit");
    cy.get('[data-test="cancel-submit-account-button"]').click();

    // Assert
    cy.url().should("include", "/accounts");
    cy.contains("a", "Create Account").should("be.visible");
  });

  it("Edit Account", function() {
    // Act - Edit Account
    cy.get('[data-test="edit-account-button"]')
      .first()
      .click();
    cy.url().should("include", "/accounts/edit");

    cy.get('[data-test="account-name-input"]')
      .clear()
      .type("Edited Account")
      .should("have.value", "Edited Account");
    cy.get('[data-test="submit-account-button"]').click();

    cy.delay(300);

    // Assert
    cy.url().should("include", "/accounts");
    cy.contains("div", "Edited Account");
  });

  it("Delete Account", function() {
    // Act - Edit Account
    cy.get('[data-test="delete-account-button"]')
      .first()
      .click();

    // Assert
    cy.url().should("include", "/accounts");
    cy.contains("a", "Create Account").should("be.visible");
  });
});
