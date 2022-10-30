describe('Dashboard Tests', () => {
  beforeEach(() => {
    cy.login();

    cy.contains('Logout');
  });

  it('should load dashboard', () => {
    cy.get('h4').should('have.text', 'Dashboard');
    cy.get('button[name=toAccounts]').should('be.visible');
  });

  it('should do something', () => {
    cy.get('h4').should('have.text', 'Dashboard');
  });
});
