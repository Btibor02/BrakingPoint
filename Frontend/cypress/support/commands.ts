Cypress.Commands.add("dataCy", (id: string): Cypress.Chainable<any> => {
  return cy.get(`[data-cy=${id}]`);
});
