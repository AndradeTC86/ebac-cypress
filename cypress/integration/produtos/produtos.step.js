/// <reference types="cypress" />

import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
const { produtosPage } = require('../../support/page_objects')
const dados = require('../../fixtures/prodIntercept.json')
const produtos = require('../../fixtures/produtos.json')
let htmlResponse

beforeEach(() => {
    cy.readFile("cypress/response/add.html").then(html=>{
      htmlResponse = html
    })
    cy.visit("/")
  })

Given('I access the product page', () => {
    cy.visit('/produtos')
})

When('I add a product in the cart', () => {
    
    cy.intercept({
        url: '/wp-admin/admin-ajax*',
        method: 'POST',                 
    }, req => {
        if(req.headers.cookie.includes("woocommerce_items_in_cart=1")){
            req.reply({
                statusCode: 200,
                body: dados.response
            })
        }        
    }).as('admin-ajax') 

    cy.intercept({
        method: 'POST',
        url: '/?wc-ajax=get_refreshed_fragments*',         
    }, req => {
                req.reply({
                statusCode: 200,
                body: dados.html
            })
    }).as('fragments')
    
    cy.intercept({
        method: 'POST',
        url: '/product/abominable-hoodie/',         
    },  req => {
        window.sessionStorage.setItem("wc_fragments_a84fb9b97c9e7516ea041e13a46d5c80", dados.html)     
        req.reply(     
         {     
            statusCode: 200,     
            body: htmlResponse
         })     
       }).as('product')

       produtosPage.inserirProduto(produtos[1].produto, produtos[1].tamanho, 
        produtos[1].cor, produtos[1].quantidade)
})

Then('In the cart I must see the product', () => {
    produtosPage.clicarPreviewCarrinho()
    produtosPage.PreviewCarrinho.should('contain', 'Abominable Hoodie - XS, Green')
})

