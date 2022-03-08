/// <reference types="cypress" />

class CarrinhoPage {

    get produto(){
        return cy.get(".product-name > a")
    }
}

module.exports = new CarrinhoPage()