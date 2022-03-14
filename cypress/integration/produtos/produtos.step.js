/// <reference types="cypress" />

import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
const { carrinhoPage, produtosPage } = require('../../support/page_objects')
const dados = require('../../fixtures/prodIntercept.json')

Given('I acces the product page', () => {
    cy.visit('/product/abominable-hoodie/')

})

When('I add a product in the cart', () => {
    cy.intercept({
        method: 'POST',
        url: '/wp-admin/admin-ajax*',         
    }, req => {
        if(req.headers.cookie.includes("woocommerce_items_in_cart=1")){
            req.reply({
                statusCode: 200,
                body: dados.response
            })
        }        
    })
    
    cy.intercept({
        method: 'POST',
        url: '/?wc-ajax=get_refreshed_fragments*',         
    }, req => {
                req.reply({
                statusCode: 200,
                body: dados.html
            })
    })

    cy.intercept({
        method: 'POST',
        url: '/product/abominable-hoodie/',         
    },  req => {
        window.sessionStorage.setItem("wc_fragments_a84fb9b97c9e7516ea041e13a46d5c80", dados.html)     
        req.reply(     
         {     
          statusCode: 200,     
          body: htmlRespostaSubmit     
         })     
       })    
})

Then('In the cart I must see the product', () => {
    cy.visit('http://lojaebac.ebaconline.art.br/carrinho/')
    carrinhoPage.produto.should('contain', 'Abominable Hoodie - XS, Green')
})

