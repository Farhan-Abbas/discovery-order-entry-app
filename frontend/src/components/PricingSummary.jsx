import React from 'react'

const PricingSummary = ({ totalOrderPrice, currency }) => {
  return (
    <div id="total-order-net-price">
      <h3>
        Total Order Net Price: 
        <span id="order-net-price">{totalOrderPrice.toFixed(2)}</span> 
        <span id="selected-currency">{currency}</span>
      </h3>
    </div>
  )
}

export default PricingSummary
