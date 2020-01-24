describe("Transactions:", function() {
  const symbol = new Date().getTime() + Math.trunc(365 * Math.random());

  beforeEach(function() {
    cy.login();

    cy.visit("/accounts");
    cy.url().should("include", "/accounts");

    cy.createAccount();

    // Temp - deplay due to eventual consistency
    cy.delay(200);

    // Display Account
    cy.get('[data-test="account-label"]')
      .first()
      .click();

    // Assert Transaction
    cy.get('[data-test="add-transaction-button"]').click();
    cy.url().should("include", "/transactions/new");
    cy.contains("button", "Create").should("be.visible");
  });

  afterEach(function() {
    // Temp - deplay due to eventual consistency
    cy.visit("/");
    cy.wait(500);
    cy.visit("/accounts");

    cy.deleteAccount();
  });

  it("Cancel Add Transaction", function() {
    // Act - Cancel Transaction
    cy.get('[data-test="cancel-create-transaction-button"]').click();
  });

  it("Add Transaction", function() {
    // Act - Create Transaction
    cy.createTransaction(symbol);
  });
});
