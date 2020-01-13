describe("Cancel Creation of Account:", function() {
  beforeEach(function() {
    // Login
    cy.login({ username: "cypress", password: "amplifyTesting" });
  });

  it("Cancel Creating Account", function() {
    cy.visit("/accounts");
    cy.url().should("include", "/accounts");

    // Create a new Account
    cy.contains("button", "Account").should("be.visible");
    cy.get('[data-test="add-account-button"]').click();
    cy.contains("button", "Create").should("be.visible");
    cy.contains("button", "Cancel").should("be.visible");
    cy.get('[data-test="cancel-create-account-button"]').click();

    cy.url().should("include", "/accounts");
    cy.contains("button", "Account").should("be.visible");
  });
});
