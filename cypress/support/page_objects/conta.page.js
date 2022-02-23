/// <reference types="cypress" />

class ContaPage {

    get #editar() {
        return cy.get(".woocommerce-MyAccount-navigation-link--edit-account > a")
    }
    
    get #nome(){
        return cy.get("#account_first_name")
    }

    get #sobrenome(){
        return cy.get("#account_last_name")
    }

    get #salvar(){
        return cy.get(".woocommerce-Button")
    }

    complete(nome, sobrenome){        
        this.#editar.click()
        this.#nome.type(nome)
        this.#sobrenome.type(sobrenome)
        this.#salvar.click()
    }
}

module.exports = new ContaPage()