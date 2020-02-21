/* eslint-disable */

describe("Accounts:", function() {
  beforeEach(function() {
    cy.login();

    cy.visit("/accounts");
    cy.url().should("include", "/accounts");
  });

  it("Cancel Creating Account", function() {
    // Arrange - create Account
    cy.contains("button", "Account").should("be.visible");
    cy.get('[data-test="add-account-button"]').click();
    cy.contains("button", "Create").should("be.visible");
    cy.contains("button", "Cancel").should("be.visible");

    // Act - cancel creating Account
    cy.get('[data-test="cancel-create-account-button"]').click();

    // Assert
    cy.url().should("include", "/accounts");
    cy.contains("button", "Account").should("be.visible");
  });

  it("Create Account", function() {
    // Act - Create Account
    cy.createAccount();

    // // Temp - delay due to eventual consistency
    // cy.delay(400);

    // // Assert - List Account
    // cy.contains("div", "My Account");
    // cy.contains("div", "My Account Description");
  });

  it("View Account", function() {
    // Temp - delay due to eventual consistency
    cy.delay(200);

    // Act - Display Account
    cy.get('[data-test="account-label"]')
      .first()
      .click();

    // Assert - Display Account
    cy.contains("div", "My Account");
    cy.contains("div", "My Account Description");
    cy.contains("button", "Edit");
    cy.contains("button", "Transaction");
  });

  it("Cancel Edit Account", function() {
    // Act - Cancel Edit Account
    cy.get('[data-test="account-label"]')
      .first()
      .click();
    cy.get('[data-test="edit-account-button"]').click();
    cy.get('[data-test="cancel-edit-account-button"]').click();

    // Assert
    cy.url().should("include", "/accounts");
    cy.contains("button", "Account").should("be.visible");
  });

  it("Edit Account", function() {
    // Act - Edit Account
    cy.get('[data-test="account-label"]')
      .first()
      .click();
    cy.get('[data-test="edit-account-button"]').click();
    cy.get('[data-test="account-name-input"]')
      .clear()
      .type("Edited Account")
      .should("have.value", "Edited Account");
    cy.get('[data-test="edit-account-button"]').click();

    // Temp - delay due to eventual consistency
    //cy.delay(400);

    // Assert
    //cy.contains("div", "Edited Account");
  });

  it("Delete Account", function() {
    // Act - Edit Account
    cy.get('[data-test="account-label"]')
      .first()
      .click();
    cy.get('[data-test="edit-account-button"]').click();
    cy.get('[data-test="account-name-input"]')
      .clear()
      .type("Edited Account")
      .should("have.value", "Edited Account");
    cy.get('[data-test="delete-account-button"]').click();

    // Assert
    cy.url().should("include", "/accounts");
    cy.contains("button", "Account").should("be.visible");
  });
});
