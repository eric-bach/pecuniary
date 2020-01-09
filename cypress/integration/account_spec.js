describe("Account:", function() {
  beforeEach(function() {
    cy.login({ username: "cypress", password: "amplifyTesting" });
  });

  const name = "My Account";
  const description = "My Account Description";
  const type = "RRSP";

  it("Visit Accounts", function() {
    cy.visit("/accounts");
    cy.url().should("include", "/accounts");

    // Create a new Account
    cy.get('[data-test="add-account-button"]').click();
    cy.get('[data-test="account-name-input"]')
      .type(name)
      .should("have.value", name);
    cy.get('[data-test="account-description-input"]')
      .type(description)
      .should("have.value", description);
    cy.get('[data-test="account-type-selector"]')
      .select(type)
      .should("have.value", type);
    cy.get('[data-test="create-account-button"]').click();

    // Assert
    // TODO Assert Account is created
  });
});
