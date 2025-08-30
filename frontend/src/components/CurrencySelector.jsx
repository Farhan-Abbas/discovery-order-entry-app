import React from 'react'

const CurrencySelector = ({ currency, setCurrency }) => {
  return (
    <div id="currency-selector">
      <label htmlFor="currency">Select Currency:</label>
      <select
        id="currency"
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
      >
        <option value="CAD">CAD</option>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="GBP">GBP</option>
      </select>
    </div>
  )
}

export default CurrencySelector
