/// <reference types="cypress" />

import { addProduct } from '../../support/commands'
import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
const { carrinhoPage, produtosPage } = require('../../support/page_objects')
const prodIntercept = require('../../fixtures/prodIntercept.json')
const produtos = require('../../fixtures/produtos.json')

Given('I acces the product page', () => {
    cy.visit('/produtos')

})

When('I add a product in the cart', () => {
    cy.intercept({
        method: 'POST',
        url: '?wc-ajax=get_refreshed_fragments',         
    }, req => {
        if(req.headers.cookie.includes("woocommerce_items_in_cart=1")){
            req.reply({
                statusCode: 200,
                body: JSON.stringify(prodIntercept.proddata)
            })
        }        
    }).as('addProd') 
    
    
    produtosPage.inserirProduto(produtos[1].produto, produtos[1].tamanho,
        produtos[1].cor, produtos[1].quantidade)

    cy.wait('@addProd')
})

Then('In the cart I must see the product', () => {
    cy.visit('http://lojaebac.ebaconline.art.br/carrinho/')
    carrinhoPage.produto.should('contain', 'Abominable Hoodie - XS, Green')
})

