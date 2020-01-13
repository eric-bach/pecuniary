describe("Display Account:", function() {
  beforeEach(function() {
    // Login
    cy.login({ username: "cypress", password: "amplifyTesting" });

    // cy.reset();

    // Create Account
    cy.createAccount();
  });

  it("View Account", function() {
    // Asser List Account
    cy.contains("div", "My Account");
    cy.contains("div", "My Account Description");

    // Display Account
    cy.get('[data-test="account-label"]')
      .first()
      .click();

    // Assert Display Account
    cy.contains("div", "My Account");
    cy.contains("div", "My Account Description");
    cy.contains("button", "Transaction");
  });
});
