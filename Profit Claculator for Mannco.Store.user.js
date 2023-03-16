// ==UserScript==
// @name         Mannco.Store - Profit Calculator for item page
// @namespace    https://github.com/LucasHenriqueDiniz/Profit-Claculator-for-Mannco.Store
// @version      1
// @description  shows the profit of the current mannco item for each different buy order
// @author       Lucas Diniz
// @match        *://mannco.store/item/*
// @icon         https://play-lh.googleusercontent.com/cSisYlwoSM5nle07xFWei9P_FGdQCeN89trORwtEkGWqado9dpcIviTLttf0nkRHI0mA=w240-h480-rw
// @grant        none

// @homepageURL  https://github.com/LucasHenriqueDiniz/Profit-Claculator-for-Mannco.Store
// @supportURL   https://github.com/LucasHenriqueDiniz/Profit-Claculator-for-Mannco.Store/issues
// @downloadURL  https://github.com/LucasHenriqueDiniz/Profit-Claculator-for-Mannco.Store/raw/main/Profit%20Claculator%20for%20Mannco.Store.user.js
// @updateURL  https://github.com/LucasHenriqueDiniz/Profit-Claculator-for-Mannco.Store/raw/main/Profit%20Claculator%20for%20Mannco.Store.user.js



// ==/UserScript==
(function () {

  // def DOM's
  const priceBox = document.querySelector("#content > div:nth-child(4) > div > div > div.col-xl-4.col-lg-7 > div.input-group.mb-3 > input");
  const highestBuyOrder = Number(document.querySelector("#content > div:nth-child(4) > div > div > div.col-xl-8.col-lg-5.mt-md-3 > table > tbody > tr:nth-child(2) > td:nth-child(1)").textContent.slice(1))
  const price = document.querySelector("#content > div.row > div:nth-child(1) > div > div > span.important-text > span").textContent.slice(1)
  const quantidadeBuyOrders = document.querySelector("#content > div:nth-child(4) > div > div > div.col-xl-8.col-lg-5.mt-md-3 > table > tbody").childElementCount - 1
  const parentDiv = document.querySelector("#content > div:nth-child(4) > div > div > div.col-xl-4.col-lg-7 > div.input-group.mb-3")
  const priceBoxBox = document.querySelector("#content > div:nth-child(4) > div > div > div.col-xl-4.col-lg-7")
  // small fixes
  document.querySelector("#content > div:nth-child(4) > div").style.borderRadius = '1rem';
  priceBoxBox.childNodes[2].textContent = ''
  priceBoxBox.childNodes[1].style.marginBottom = '25px';
  priceBoxBox.childNodes[1].style.fontSize = '1.5rem'
  priceBox.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
  priceBox.style.borderRadius = '1rem 0 1rem 0'

  function calculateFees(y) {
    let x = parseFloat(y)
    if (x <= 0.05) {
      return x.toFixed(2);
    } else if (x > 0.05 && x <= 0.10) {
      return (x - 0.01).toFixed(2);
    } else if (x > 0.10 && x <= 0.11) {
      return 0.09.toFixed(2);
    } else {
      return (x * 0.05).toFixed(2);
    }
  }

  function CheckLucro(BuyOrder) {
    var profit = ((price - BuyOrder) - calculateFees(BuyOrder))
    console.log(BuyOrder, calculateFees(BuyOrder), profit)

    return parseFloat(profit.toFixed(2)).toFixed(2);
  }

  const afterFeesElement = document.createElement("div");
  afterFeesElement.textContent = "After fees: $NaN"; // definindo o conteúdo inicial
  afterFeesElement.style.color = "gray";
  afterFeesElement.style.position = "absolute";
  afterFeesElement.style.bottom = "0";
  afterFeesElement.style.left = "0";
  afterFeesElement.style.width = "100%";
  afterFeesElement.style.textAlign = "center";
  afterFeesElement.style.paddingBottom = '5px';
  priceBox.parentNode.appendChild(afterFeesElement);
  afterFeesElement.style.height = (afterFeesElement.offsetHeight * 2 + 'px')

  const ProfitElement = document.createElement("div");
  ProfitElement.textContent = "Profit: $NaN"; // definindo o conteúdo inicial
  ProfitElement.style.color = "gray";
  ProfitElement.style.position = "absolute";
  ProfitElement.style.bottom = "0";
  ProfitElement.style.left = "0";
  ProfitElement.style.width = "100%";
  ProfitElement.style.textAlign = "center";
  ProfitElement.style.paddingBottom = '5px';
  priceBox.parentNode.appendChild(ProfitElement);

  function updateAfterFees() {
    const value = parseFloat(priceBox.value);
    const fees = calculateFees(value);
    const afterFees = value - fees;
    const profit = CheckLucro(value)

    // verificação do valor de afterFees
    if (isNaN(afterFees)) {
      afterFeesElement.textContent = "After fees: $NaN";
    } else {
      afterFeesElement.textContent = `After fees: ${afterFees.toFixed(2)}`;
    }
    if (isNaN(profit)) {
      ProfitElement.textContent = "Profit: $NaN";
    } else {
      ProfitElement.textContent = `Profit with current BuyOrder: ${CheckLucro(value)}`;
    }
  }

  priceBox.addEventListener("input", updateAfterFees);
  priceBox.addEventListener("change", updateAfterFees);

  // definindo a altura do parentDiv
  const parentHeight = priceBox.offsetHeight + afterFeesElement.offsetHeight + 10;
  parentDiv.style.height = parentHeight + "px";
  parentDiv.style.backgroundColor = '#202334'
  parentDiv.style.borderRadius = '1rem';

  document.querySelector("#recipient-username-addon").style.borderBottomRightRadius = '2rem'
  document.querySelector("#recipient-username-addon").style.borderTopRightRadius = '1rem'

  var ProfitLabel = document.createElement('th')
  ProfitLabel.scope = 'col'
  ProfitLabel.title = 'The profit is calculated by = [fees - (SellValue - BuyValue)] you can put you mouse over each profit to see the values and etc'
  ProfitLabel.textContent = "Profit"
  document.querySelector("#content > div:nth-child(4) > div > div > div.col-xl-8.col-lg-5.mt-md-3 > table > tbody > tr:nth-child(1)").appendChild(ProfitLabel)

  for (var i = 1; quantidadeBuyOrders >= i; i++) {
    let currentBuyOrderRaw = document.querySelector(`#content > div:nth-child(4) > div > div > div.col-xl-8.col-lg-5.mt-md-3 > table > tbody > tr:nth-child(${i + 1}) > td:nth-child(1)`);
    let currentBuyOrder = currentBuyOrderRaw.textContent.slice(1).replace(' or less', '');

    currentBuyOrderRaw.parentElement.addEventListener('click', () => {
      priceBox.value = currentBuyOrder;
      updateAfterFees()
    });

    var NewElement = document.createElement('td')
    NewElement.textContent = ("$" + CheckLucro(currentBuyOrder))
    NewElement.title = `[fees - (SellValue - BuyValue)]`
    document.querySelector("#content > div:nth-child(4) > div > div > div.col-xl-8.col-lg-5.mt-md-3 > table > tbody").children[i].appendChild(NewElement)
    try {
      if (i % 2 != 0) {
        currentBuyOrder.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
      }
    } catch (TypeError) {
      console.log(TypeError)
    }
  }
})();
