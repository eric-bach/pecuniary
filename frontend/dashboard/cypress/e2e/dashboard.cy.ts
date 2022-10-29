describe('Accounts', () => {
  it('finds accounts', () => {
    cy.visit('http://localhost:8080/auth/signin');

    cy.get('input[name=email]').type('email@gmail.com');
  });
});
