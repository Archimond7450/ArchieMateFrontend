describe("Navigation", () => {
  beforeEach(() => {
    cy.viewport(1000, 660);
    cy.visit("/404/", { failOnStatusCode: false });
  });
  it("Appbar Logo navigates to /", () => {
    cy.get("[data-testid='appbar-logo']").click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal("/");
    });
  });
  it("Appbar Home icon navigates to /", () => {
    cy.get("[data-testid='appbar-home']").click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal("/");
    });
  });
  it("Appbar Docs icon navigates to /docs", () => {
    cy.get("[data-testid='appbar-docs']").click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal("/docs");
    });
  });
  it("Appbar Login icon navigates to /login", () => {
    cy.get("[data-testid='appbar-login']").click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal("/login");
    });
  });
});

describe("Mobile navigation", () => {
  beforeEach(() => {
    cy.viewport(550, 750);
    cy.visit("/404/", { failOnStatusCode: false });
  });

  it("Appbar Logo link navigates to /", () => {
    cy.get("[data-testid='appbar-logo-mobile']").click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal("/");
    });
  });
  it("Appbar Home icon navigates to / ", () => {
    cy.get("[data-testid='MenuIcon']").click();
    cy.get("[data-testid='appbar-home-mobile']").click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal("/");
    });
  });
  it("Appbar Docs icon navigates to /docs", () => {
    cy.get("[data-testid='MenuIcon']").click();
    cy.get("[data-testid='appbar-docs-mobile']").click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal("/docs");
    });
  });
  it("Appbar Login icon navigates to /login", () => {
    cy.get("[data-testid='appbar-login']").click();
    cy.location().should((loc) => {
      expect(loc.pathname).to.equal("/login");
    });
  });
});
