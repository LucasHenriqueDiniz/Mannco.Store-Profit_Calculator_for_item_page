// ==UserScript==
// @name         Profit Claculator for Mannco.Store
// @namespace    https://github.com/LucasHenriqueDiniz/Profit-Claculator-for-Mannco.Store
// @version      0.1
// @description  tshow the profit of the current mannco item
// @author       Lucas Diniz
// @match        *://mannco.store/item/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mannco.store
// @grant        none

// @homepageURL  https://github.com/LucasHenriqueDiniz/Profit-Claculator-for-Mannco.Store
// @supportURL   https://github.com/LucasHenriqueDiniz/Profit-Claculator-for-Mannco.Store/issues
// @downloadURL


// ==/UserScript==

(function() {
const CaixaDeValor = document.querySelector("#content > div:nth-child(4) > div > div > div.col-xl-4.col-lg-7 > div.input-group.mb-3 > input");
const MaiorBuyOrder = Number(document.querySelector("#content > div:nth-child(4) > div > div > div.col-xl-8.col-lg-5.mt-md-3 > table > tbody > tr:nth-child(2) > td:nth-child(1)").textContent.slice(1))
const PreçoVenda = document.querySelector("#content > div.row > div:nth-child(1) > div > div > span.important-text > span").textContent.slice(1)

function CheckLucro(Valor) {
    var LucroBruto
    var LucroLiquido = Math.abs(Math.round((Valor - PreçoVenda) * 100) / 100)
    var Fees = Math.round((5/100 * PreçoVenda) * 100) / 100

    console.log(LucroLiquido, Fees, Valor)

    if (PreçoVenda < 0.05) {
        LucroBruto = LucroLiquido
    } else {
        LucroBruto = Math.round(( LucroLiquido - Fees) * 100) / 100
    }

    return LucroBruto
}
var ProfitLabel = document.createElement('th')
ProfitLabel.scope = 'col'
ProfitLabel.textContent = "Profit"
document.querySelector("#content > div:nth-child(4) > div > div > div.col-xl-8.col-lg-5.mt-md-3 > table > tbody > tr:nth-child(1)").appendChild(ProfitLabel)

var Quant = document.querySelector("#content > div:nth-child(4) > div > div > div.col-xl-8.col-lg-5.mt-md-3 > table > tbody").childElementCount - 1

for (var i = 1; Quant >= i; i++) {
    var currentBuyOrder = document.querySelector(`#content > div:nth-child(4) > div > div > div.col-xl-8.col-lg-5.mt-md-3 > table > tbody > tr:nth-child(${i+1}) > td:nth-child(1)`).textContent.slice(1).replace(' or less', '')


    var NewElement = document.createElement('td')
    NewElement.textContent = ("$" + CheckLucro(currentBuyOrder))
    NewElement.title = (`Profit = Fees(${Math.round((5/100 * PreçoVenda) * 100) / 100}) - [sellValue(${PreçoVenda}) - BuyOrderPrice(${currentBuyOrder}]`)
    document.querySelector("#content > div:nth-child(4) > div > div > div.col-xl-8.col-lg-5.mt-md-3 > table > tbody").children[i].appendChild(NewElement)
    }

document.querySelector("#content > div:nth-child(4) > div > div > div.col-xl-4.col-lg-7 > p").textContent = "Profit with current BuyOrder: " + CheckLucro(CaixaDeValor.value)
})();
