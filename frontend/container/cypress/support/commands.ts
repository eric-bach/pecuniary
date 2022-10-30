Cypress.Commands.add('login', () => {
  cy.visit('/auth/signin');

  cy.get('input[name=email]').type(Cypress.env('username'));
  cy.get('input[name=password]').type(Cypress.env('password'));
  cy.get('button[name=signin]').contains('Sign In', { timeout: 1000 }).click();
});
