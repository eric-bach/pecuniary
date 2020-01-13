// describe("Create Account:", function() {
//   beforeEach(function() {
//     // Login
//     cy.login({ username: "cypress", password: "amplifyTesting" });

//     // cy.reset();

//     // Create Account
//     cy.createAccount();
//   });

//   it("View Account", function() {
//     // Asser List Account
//     cy.contains("div", "My Account");
//     cy.contains("div", "My Account Description");

//     // Display Account
//     cy.get('[data-test="account-label"]')
//       .first()
//       .click();
//     // Assert Display Account
//     cy.contains("div", "My Account");
//     cy.contains("div", "My Account Description");
//     cy.contains("button", "Transaction");

//     // Assert Transaction
//     cy.get('[data-test="add-transaction-button"]').click();
//     cy.url().should("include", "/transactions/new");
//     cy.contains("button", "Create").should("be.visible");
//     // Create Transaction
//     // TODO Create a Cypress Command
//     cy.get('[data-test="transaction-type-selector"]')
//       .select("Buy")
//       .should("have.value", "Buy");
//     cy.get('[data-test="transaction-date-input"]').should(
//       "have.value",
//       Cypress.moment().format("YYYY-MM-DD")
//     );
//     cy.get('[data-test="security-input"]')
//       .type("BMO")
//       .should("have.value", "BMO");
//     cy.get('[data-test="shares-input"]')
//       .type("1000")
//       .should("have.value", "1000");
//     cy.get('[data-test="price-input"]')
//       .type("98.10")
//       .should("have.value", "98.10");
//     cy.get('[data-test="commission-input"]')
//       .type("9.95")
//       .should("have.value", "9.95");
//     cy.get('[data-test="create-security-link"]')
//       .should("be.visible")
//       .click();

//     // Assert Security
//     cy.get('[data-test="security-name-input"]').should("have.value", "BMO");
//     // Create Security
//     cy.get('[data-test="security-description-input"]')
//       .type("Bank of Montreal")
//       .should("have.value", "Bank of Montreal");
//     cy.get('[data-test="security-exchange-type-selector"]')
//       .select("TSX")
//       .should("have.value", "TSX");
//     cy.get('[data-test="create-security-button"]').click();

//     // Create Transaction
//     cy.get('[data-test="create-security-link"]');
//     // .should()
//     // .not("be.visible")
//     // .click();
//     // cy.get('[data-test="create-transaction-button"]').click();
//   });
// });
